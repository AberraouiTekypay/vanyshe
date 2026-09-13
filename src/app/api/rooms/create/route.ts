import { NextResponse } from 'next/server';
import { createRoom } from '@/lib/rooms';
import { recordEvent } from '@/lib/analytics';
import { hashRoomId } from '@/lib/crypto';

export async function POST(request: Request) {
  try {
    const { room, creatorToken } = createRoom();

    // Ingest first-party anonymous room_created event
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // body optional
    }

    recordEvent({
      eventName: 'room_created',
      anonymousId: body.anonymousId,
      roomSafeRef: hashRoomId(room.id),
      sessionId: body.sessionId,
      language: body.language || 'en',
      deviceCategory: body.deviceCategory,
      browserCategory: body.browserCategory,
      referrerCategory: body.referrerCategory,
    });

    return NextResponse.json({
      roomId: room.id,
      creatorToken,
      expiresAt: room.expiresAt,
      status: room.status,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json({ error: 'Failed to create private room' }, { status: 500 });
  }
}
