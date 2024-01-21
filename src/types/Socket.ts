import type { Participant } from "livekit-client"
import type { MessageWithMemberProfile } from "./MessageWithMemberProfile"
import { Socket } from "socket.io"

export const SOCKET_EVENTS = {
  "message:create": "message:create",
  "message:update": "message:update",
  "message:delete": "message:delete",
  "screen-share:join": "screen-share:join",
  "screen-share:leave": "screen-share:leave",
  "screen-share:viewing": "screen-share:viewing",
} as const

export type SocketData = {
  message?: MessageWithMemberProfile
  participant?: Participant
  viewer?: Participant
  transmitter?: Participant
  currentViews?: Participant[]
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
