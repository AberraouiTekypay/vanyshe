import { describe, it, expect, beforeEach } from 'vitest';
import {
  createRoom,
  getRoom,
  registerParticipant,
  unregisterParticipant,
  destroyRoom,
  addSignal,
  getSignals,
  _resetStoreForTesting,
} from '../src/lib/rooms';
import { generateRoomId, hashRoomId } from '../src/lib/crypto';

describe('Ephemeral Room Lifecycle', () => {
  beforeEach(() => {
    _resetStoreForTesting();
  });

  it('generates high-entropy room identifiers in expected format', () => {
    const id1 = generateRoomId();
    const id2 = generateRoomId();

    expect(id1).toMatch(/^vny-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}$/);
    expect(id2).toMatch(/^vny-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}$/);
    expect(id1).not.toBe(id2);
  });

  it('creates a room with CREATED state and 60-minute expiration', () => {
    const { room, creatorToken } = createRoom();

    expect(room.id).toBeDefined();
    expect(room.status).toBe('CREATED');
    expect(creatorToken).toBeDefined();
    expect(room.expiresAt).toBeGreaterThan(Date.now() + 50 * 60 * 1000);

    const fetched = getRoom(room.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.id).toBe(room.id);
  });

  it('handles participant join and updates state from WAITING to ACTIVE', () => {
    const { room } = createRoom();

    // First participant
    const res1 = registerParticipant(room.id);
    expect(res1.success).toBe(true);
    expect(res1.status).toBe('WAITING');

    // Second participant
    const res2 = registerParticipant(room.id);
    expect(res2.success).toBe(true);
    expect(res2.status).toBe('ACTIVE');

    const updated = getRoom(room.id);
    expect(updated?.participantsCount).toBe(2);
    expect(updated?.status).toBe('ACTIVE');
  });

  it('wipes signals and prevents reuse when room is destroyed by creator', () => {
    const { room, creatorToken } = createRoom();

    // Add a signal
    addSignal(room.id, {
      senderId: 'peer_1',
      type: 'offer',
      payload: { sdp: 'test-sdp-offer' },
    });

    const signalsBefore = getSignals(room.id, 0, 'peer_2');
    expect(signalsBefore.length).toBe(1);

    // Wrong token fails
    const failResult = destroyRoom(room.id, 'wrong-token-123');
    expect(failResult.success).toBe(false);

    // Correct token destroys room
    const destroyResult = destroyRoom(room.id, creatorToken);
    expect(destroyResult.success).toBe(true);

    const destroyed = getRoom(room.id);
    expect(destroyed?.status).toBe('DESTROYED');

    // All signals must be wiped immediately
    const signalsAfter = getSignals(room.id, 0, 'peer_2');
    expect(signalsAfter.length).toBe(0);

    // New signals cannot be added
    const addAfter = addSignal(room.id, {
      senderId: 'peer_2',
      type: 'answer',
      payload: { sdp: 'test-sdp-answer' },
    });
    expect(addAfter).toBeNull();

    // New participants cannot join
    const joinAfter = registerParticipant(room.id);
    expect(joinAfter.success).toBe(false);
    expect(joinAfter.status).toBe('DESTROYED');
  });

  it('detects room expiration', () => {
    const { room } = createRoom();
    // artifically expire
    room.expiresAt = Date.now() - 1000;

    const fetched = getRoom(room.id);
    expect(fetched?.status).toBe('EXPIRED');
  });

  it('supports multi-participant rooms up to MAX_ROOM_PARTICIPANTS (8)', () => {
    const { room } = createRoom();

    // Register up to 8 participants
    for (let i = 1; i <= 8; i++) {
      const res = registerParticipant(room.id);
      expect(res.success).toBe(true);
    }

    const fetched = getRoom(room.id);
    expect(fetched?.participantsCount).toBe(8);

    // 9th participant must be rejected
    const res9 = registerParticipant(room.id);
    expect(res9.success).toBe(false);
    expect(res9.error).toContain('maximum capacity');
  });

  it('routes target-specific signals only to designated recipient', () => {
    const { room } = createRoom();

    // Broadcast signal (no targetId)
    addSignal(room.id, {
      senderId: 'peer_1',
      type: 'participant-joined',
      payload: { peerId: 'peer_1' },
    });

    // Targeted signal from peer_1 to peer_2
    addSignal(room.id, {
      senderId: 'peer_1',
      targetId: 'peer_2',
      type: 'offer',
      payload: { sdp: 'offer-for-peer-2' },
    });

    // Peer 2 should receive both
    const peer2Signals = getSignals(room.id, 0, 'peer_2');
    expect(peer2Signals.length).toBe(2);

    // Peer 3 should only receive the broadcast signal, NOT the one targeted to peer 2
    const peer3Signals = getSignals(room.id, 0, 'peer_3');
    expect(peer3Signals.length).toBe(1);
    expect(peer3Signals[0].type).toBe('participant-joined');
  });
});
