import type { Participant } from "livekit-client"
import type { MessageWithMemberProfile } from "./MessageWithMemberProfile"
import { Socket } from "socket.io"
import { MemberWithProfile } from "./MemberProfile"
import { Channel, Profile, Server } from "../../prisma/output"
import { ConversationWithProfiles } from "./ConversationWithProfiles"

export const SOCKET_EVENTS = {
  "message:create": "message:create",
  "message:update": "message:update",
  "message:delete": "message:delete",
  "stream:start": "stream:start",
  "stream:join": "stream:join",
  "stream:leave": "stream:leave",
  "stream:stop": "stream:stop",
  "stream:update": "stream:update",
  "channel:join": "channel:join",
  "channel:leave": "channel:leave",
  "call:start": "call:start",
  "call:going": "call:going",
  "call:stop": "call:stop",
  "call:join": "call:join",
  "call:leave": "call:leave",
  "server:join": "server:join",
  "server:leave": "server:leave",
} as const

export type SocketEvents = keyof typeof SOCKET_EVENTS

export const SOCKET_EVENTS_ARRAY = Object.keys(SOCKET_EVENTS) as SocketEvents[]

export type SocketData = {
  message?: MessageWithMemberProfile
  participant?: Participant
  streamer?: Participant
  viewer?: Participant
  member?: MemberWithProfile
  channel?: Channel
  conversation?: ConversationWithProfiles
  caller?: Profile
  called?: Profile
  startCallId?: NodeJS.Timeout
  server?: Server
}

export type SocketFn = (data: SocketData) => void

// when emitting an event on server
// when listinning to events on client
export type ServerToClientEvents = {
  [key in keyof typeof SOCKET_EVENTS]: (data: SocketData) => void
}

// when listining to an event on server
// when emitting an event on client
export type ClientToServerEvents = {
  [key in keyof typeof SOCKET_EVENTS]: (data: SocketData) => void
}

// when emitting an event server to server
export type InterServerEvents = {}

export type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>
export type ServerSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>
