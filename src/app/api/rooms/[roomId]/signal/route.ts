import { NextResponse } from 'next/server';
import { addSignal, getSignals, getRoom } from '@/lib/rooms';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const room = getRoom(roomId);

  if (!room || room.status === 'DESTROYED' || room.status === 'EXPIRED') {
    return NextResponse.json({
      signals: [],
      roomStatus: room ? room.status : 'EXPIRED',
    });
  }

  const { searchParams } = new URL(request.url);
  const since = parseInt(searchParams.get('since') || '0', 10);
  const senderId = searchParams.get('senderId') || '';

  const signals = getSignals(roomId, since, senderId);

  return NextResponse.json({
    signals,
    roomStatus: room.status,
    timestamp: Date.now(),
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const room = getRoom(roomId);

  if (!room || room.status === 'DESTROYED' || room.status === 'EXPIRED') {
    return NextResponse.json(
      { error: 'Room is not active or has been destroyed', roomStatus: room ? room.status : 'EXPIRED' },
      { status: 410 }
    );
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { senderId, targetId, type, payload } = body;

  if (!senderId || !type || !payload) {
    return NextResponse.json({ error: 'Missing required signal fields' }, { status: 400 });
  }

  // Validate signal type (must be WebRTC offer, answer, or candidate)
  if (!['offer', 'answer', 'candidate', 'participant-joined', 'participant-left', 'room-destroyed'].includes(type)) {
    return NextResponse.json({ error: 'Invalid signal type' }, { status: 400 });
  }

  const signal = addSignal(roomId, {
    senderId,
    targetId,
    type,
    payload,
  });

  if (!signal) {
    return NextResponse.json({ error: 'Failed to record signal' }, { status: 500 });
  }

  return NextResponse.json({ success: true, signalId: signal.id, timestamp: signal.timestamp });
}
