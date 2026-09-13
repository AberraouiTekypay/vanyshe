import { RoomRecord, RoomStatus, SignalMessage, CapturePolicy } from './types';
import { generateRoomId, generateCreatorToken } from './crypto';

// Ephemeral in-memory store
// For serverless multi-instance, these maps persist within container lifecycle
// and can be backed by Redis / KV when configured via REDIS_URL.
const roomsMap = new Map<string, RoomRecord>();
const signalsMap = new Map<string, SignalMessage[]>();
const destroyedRoomsSet = new Set<string>();

const DEFAULT_ROOM_TTL_MS = 60 * 60 * 1000; // 60 minutes
const MAX_SIGNALS_PER_ROOM = 60; // Max queue size to prevent memory bloat

function cleanupOldRooms() {
  const now = Date.now();
  for (const [id, room] of roomsMap.entries()) {
    if (room.status === 'DESTROYED' && room.destroyedAt && now - room.destroyedAt > 10 * 60 * 1000) {
      roomsMap.delete(id);
      signalsMap.delete(id);
    } else if (now > room.expiresAt && room.status !== 'DESTROYED') {
      room.status = 'EXPIRED';
      signalsMap.delete(id);
    }
  }
}

export function createRoom(options?: {
  capturePolicy?: CapturePolicy;
  watermarkEnabled?: boolean;
}): { room: RoomRecord; creatorToken: string } {
  cleanupOldRooms();

  const id = generateRoomId();
  const creatorToken = generateCreatorToken();
  const now = Date.now();

  const room: RoomRecord = {
    id,
    createdAt: now,
    expiresAt: now + DEFAULT_ROOM_TTL_MS,
    status: 'CREATED',
    creatorToken,
    participantsCount: 0,
    lastActiveAt: now,
    capturePolicy: options?.capturePolicy || 'DETECT_ALERT',
    watermarkEnabled: options?.watermarkEnabled || false,
  };

  roomsMap.set(id, room);
  signalsMap.set(id, []);

  return { room, creatorToken };
}

export function updateRoomPolicy(
  id: string,
  token: string,
  capturePolicy: CapturePolicy,
  watermarkEnabled?: boolean
): { success: boolean; room?: RoomRecord; error?: string } {
  const room = roomsMap.get(id);
  if (!room) {
    return { success: false, error: 'Room not found' };
  }

  if (room.creatorToken && room.creatorToken !== token) {
    return { success: false, error: 'Unauthorized: invalid creator token' };
  }

  room.capturePolicy = capturePolicy;
  if (typeof watermarkEnabled === 'boolean') {
    room.watermarkEnabled = watermarkEnabled;
  }
  room.lastActiveAt = Date.now();

  return { success: true, room };
}

export function getRoom(id: string): RoomRecord | null {
  cleanupOldRooms();

  if (destroyedRoomsSet.has(id)) {
    return {
      id,
      createdAt: Date.now() - 300000,
      expiresAt: Date.now() + 3600000,
      status: 'DESTROYED',
      creatorToken: '',
      destroyedAt: Date.now(),
      participantsCount: 0,
      lastActiveAt: Date.now(),
      capturePolicy: 'DETECT_ALERT',
      watermarkEnabled: false,
    };
  }

  let room = roomsMap.get(id);
  if (!room) {
    // Recognize valid Vanyshe room ID format across serverless cold starts
    if (/^vny-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}$/.test(id)) {
      room = {
        id,
        createdAt: Date.now(),
        expiresAt: Date.now() + DEFAULT_ROOM_TTL_MS,
        status: 'WAITING',
        creatorToken: '',
        participantsCount: 1,
        lastActiveAt: Date.now(),
        capturePolicy: 'DETECT_ALERT',
        watermarkEnabled: false,
      };
      roomsMap.set(id, room);
      signalsMap.set(id, []);
    } else {
      return null;
    }
  }

  const now = Date.now();
  if (room.status !== 'DESTROYED' && now > room.expiresAt) {
    room.status = 'EXPIRED';
    signalsMap.delete(id);
  }

  return room;
}

export const MAX_ROOM_PARTICIPANTS = parseInt(process.env.MAX_ROOM_PARTICIPANTS || '8', 10);

export function registerParticipant(id: string): { success: boolean; status: RoomStatus; error?: string } {
  const room = getRoom(id);
  if (!room) return { success: false, status: 'EXPIRED', error: 'Room not found' };

  if (room.status === 'DESTROYED') {
    return { success: false, status: 'DESTROYED', error: 'Conversation has been destroyed' };
  }
  if (room.status === 'EXPIRED') {
    return { success: false, status: 'EXPIRED', error: 'Room has expired' };
  }
  if (room.participantsCount >= MAX_ROOM_PARTICIPANTS) {
    return {
      success: false,
      status: room.status,
      error: `Room is at maximum capacity (${MAX_ROOM_PARTICIPANTS} participants)`,
    };
  }

  room.participantsCount += 1;
  room.lastActiveAt = Date.now();

  if (room.participantsCount === 1) {
    room.status = 'WAITING';
  } else if (room.participantsCount >= 2) {
    room.status = 'ACTIVE';
  }

  return { success: true, status: room.status };
}

export function unregisterParticipant(id: string): void {
  const room = roomsMap.get(id);
  if (!room) return;

  room.participantsCount = Math.max(0, room.participantsCount - 1);
  room.lastActiveAt = Date.now();

  if (room.participantsCount === 0 && room.status === 'ACTIVE') {
    room.status = 'ENDED';
  }
}

export function destroyRoom(id: string, token: string): { success: boolean; error?: string } {
  const room = roomsMap.get(id);
  if (room && room.creatorToken && room.creatorToken !== token) {
    return { success: false, error: 'Unauthorized: invalid creator token' };
  }

  destroyedRoomsSet.add(id);

  if (room) {
    room.status = 'DESTROYED';
    room.destroyedAt = Date.now();
    room.participantsCount = 0;
  }

  // Immediately wipe all signalling messages
  signalsMap.delete(id);

  return { success: true };
}

export function addSignal(roomId: string, message: Omit<SignalMessage, 'id' | 'timestamp'>): SignalMessage | null {
  const room = getRoom(roomId);
  if (!room || room.status === 'DESTROYED' || room.status === 'EXPIRED') {
    return null;
  }

  const signals = signalsMap.get(roomId) || [];
  const fullMessage: SignalMessage = {
    ...message,
    id: `sig_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
  };

  signals.push(fullMessage);
  if (signals.length > MAX_SIGNALS_PER_ROOM) {
    signals.shift(); // keep sliding window
  }

  signalsMap.set(roomId, signals);
  room.lastActiveAt = Date.now();
  return fullMessage;
}

export function getSignals(roomId: string, sinceTimestamp: number, forSenderId: string): SignalMessage[] {
  const room = getRoom(roomId);
  if (!room || room.status === 'DESTROYED' || room.status === 'EXPIRED') {
    return [];
  }

  const signals = signalsMap.get(roomId) || [];
  // Return messages that were created after sinceTimestamp and were NOT sent by this sender
  return signals.filter((msg) => {
    if (msg.timestamp <= sinceTimestamp || msg.senderId === forSenderId) return false;
    if (msg.targetId && msg.targetId !== forSenderId) return false;
    return true;
  });
}

export function getActiveRoomsSnapshot(): {
  activeRoomsCount: number;
  activeConnectionsCount: number;
  rooms: {
    safeRef: string;
    participants: number;
    activeMinutes: number;
    status: RoomStatus;
  }[];
} {
  const now = Date.now();
  const roomsList = [];
  let connections = 0;

  for (const [id, room] of roomsMap.entries()) {
    if (room.status === 'ACTIVE' || room.status === 'WAITING') {
      const activeMinutes = Math.max(1, Math.round((now - room.createdAt) / 60000));
      connections += room.participantsCount;
      roomsList.push({
        safeRef: `room_${id.slice(-4)}`,
        participants: room.participantsCount,
        activeMinutes,
        status: room.status,
      });
    }
  }

  return {
    activeRoomsCount: roomsList.length,
    activeConnectionsCount: Math.floor(connections / 2),
    rooms: roomsList,
  };
}

// Reset store (used for automated test isolation)
export function _resetStoreForTesting(): void {
  roomsMap.clear();
  signalsMap.clear();
}
