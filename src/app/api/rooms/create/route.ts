import { NextResponse } from 'next/server';
import { createRoom } from '@/lib/rooms';
import { recordEvent } from '@/lib/analytics';
import { hashRoomId } from '@/lib/crypto';

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // body optional
    }

    const { room, creatorToken } = createRoom({
      capturePolicy: body.capturePolicy,
      watermarkEnabled: body.watermarkEnabled,
    });

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

    if (room.capturePolicy && room.capturePolicy !== 'OFF') {
      recordEvent({
        eventName: 'privacy_shield_policy_set',
        anonymousId: body.anonymousId,
        roomSafeRef: hashRoomId(room.id),
        sessionId: body.sessionId,
        language: body.language || 'en',
      });
    }

    return NextResponse.json({
      roomId: room.id,
      creatorToken,
      expiresAt: room.expiresAt,
      status: room.status,
      capturePolicy: room.capturePolicy,
      watermarkEnabled: room.watermarkEnabled,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json({ error: 'Failed to create private room' }, { status: 500 });
  }
}
