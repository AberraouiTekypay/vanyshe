export type RoomStatus =
  | 'CREATED'
  | 'WAITING'
  | 'ACTIVE'
  | 'ENDED'
  | 'EXPIRED'
  | 'DESTROYED';

export interface RoomRecord {
  id: string;
  createdAt: number;
  expiresAt: number;
  status: RoomStatus;
  creatorToken: string;
  destroyedAt?: number;
  participantsCount: number;
  lastActiveAt: number;
}

export interface SignalMessage {
  id: string;
  senderId: string;
  targetId?: string;
  type: 'offer' | 'answer' | 'candidate' | 'participant-joined' | 'participant-left' | 'room-destroyed';
  payload: any;
  timestamp: number;
}

export type SupportedLocale = 'en' | 'fr' | 'ar';

export type EventName =
  | 'page_view'
  | 'landing_cta_clicked'
  | 'language_selected'
  | 'room_created'
  | 'room_link_copied'
  | 'room_joined'
  | 'room_connection_started'
  | 'room_connection_established'
  | 'call_started'
  | 'call_ended'
  | 'room_destroyed'
  | 'room_expired'
  | 'camera_enabled'
  | 'camera_disabled'
  | 'microphone_enabled'
  | 'microphone_disabled'
  | 'screen_share_started'
  | 'screen_share_ended'
  | 'return_visit'
  | 'return_room_created';

export interface AnalyticsEvent {
  eventId: string;
  eventName: EventName;
  anonymousId: string;
  timestamp: number;
  roomSafeRef?: string; // HMAC/SHA-256 hash of roomId, never plain room URL
  sessionId: string;
  language: SupportedLocale;
  country: string;
  deviceCategory: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  browserCategory: string;
  referrerCategory: 'direct' | 'search' | 'referral' | 'shared_link' | 'social' | 'unknown';
  appVersion: string;
  durationSeconds?: number;
  errorCategory?: string;
}

export interface OperationalState {
  activeRoomsCount: number;
  activeConnectionsCount: number;
  rooms: {
    safeRef: string;
    participants: number;
    activeMinutes: number;
    status: RoomStatus;
  }[];
  recentErrors: {
    category: string;
    count: number;
    lastSeen: number;
  }[];
}
