import { NextResponse } from 'next/server';
import { getRoom, registerParticipant, unregisterParticipant, destroyRoom } from '@/lib/rooms';
import { recordEvent } from '@/lib/analytics';
import { hashRoomId } from '@/lib/crypto';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const room = getRoom(roomId);

  if (!room) {
    return NextResponse.json({ status: 'EXPIRED', error: 'Room not found or expired' }, { status: 404 });
  }

  return NextResponse.json({
    roomId: room.id,
    status: room.status,
    expiresAt: room.expiresAt,
    participantsCount: room.participantsCount,
    destroyedAt: room.destroyedAt,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { action, creatorToken, anonymousId, sessionId, language } = body;

  if (action === 'join') {
    const result = registerParticipant(roomId);
    if (!result.success) {
      return NextResponse.json({ error: result.error, status: result.status }, { status: 400 });
    }

    recordEvent({
      eventName: 'room_joined',
      anonymousId,
      sessionId,
      roomSafeRef: hashRoomId(roomId),
      language: language || 'en',
    });

    return NextResponse.json({ success: true, status: result.status });
  }

  if (action === 'leave') {
    unregisterParticipant(roomId);
    return NextResponse.json({ success: true });
  }

  if (action === 'destroy') {
    if (!creatorToken) {
      return NextResponse.json({ error: 'Missing creator token' }, { status: 401 });
    }

    const result = destroyRoom(roomId, creatorToken);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    recordEvent({
      eventName: 'room_destroyed',
      anonymousId,
      sessionId,
      roomSafeRef: hashRoomId(roomId),
      language: language || 'en',
    });

    return NextResponse.json({ success: true, status: 'DESTROYED' });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
