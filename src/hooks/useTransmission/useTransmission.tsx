"use client"
import { useStore } from "zustand"
import transmissionStore from "./transmissionStore"
import { useEffect } from "react"
import useSocket from "../useSocket/useSocket"
import { SocketFn } from "@/types/Socket"
import { Participant } from "livekit-client"

export default function useTransmission() {
  const { socket } = useSocket()
  const {
    transmissions,
    addStreamer,
    addViewer,
    removeViewer,
    removeStreamer,
    ...publicMethods
  } = useStore(transmissionStore)

  const startTransmission = (streamer: Participant) => {
    if (!streamer || !socket) return
    socket.emit("stream:start", {
      streamer,
    })
  }

  const stopTransmission = (streamer: Participant) => {
    if (!streamer || !socket) return
    socket.emit("stream:stop", {
      streamer,
    })
  }

  const joinTransmission = (streamer: Participant, viewer: Participant) => {
    if (!streamer || !viewer || !socket) return
    socket.emit("stream:join", {
      streamer,
      viewer,
    })
  }

  const leaveTransmission = (streamer: Participant, viewer: Participant) => {
    if (!streamer || !viewer || !socket) return
    socket.emit("stream:leave", {
      streamer,
      viewer,
    })
  }

  useEffect(() => {
    if (!socket) return

    const startTransmissionHandler: SocketFn = ({ streamer }) => {
      if (!streamer) return
      addStreamer(streamer)
    }

    const joinTransmissionHandler: SocketFn = ({ viewer, streamer }) => {
      if (!streamer || !viewer) return
      addViewer(streamer, viewer)
    }

    const leaveTransmissionHandler: SocketFn = ({ viewer, streamer }) => {
      if (!streamer || !viewer) return
      removeViewer(streamer, viewer)
    }

    const stopTransmissionHandler: SocketFn = ({ streamer }) => {
      if (!streamer) return
      removeStreamer(streamer)
    }

    socket.on("stream:start", startTransmissionHandler)
    socket.on("stream:join", joinTransmissionHandler)
    socket.on("stream:leave", leaveTransmissionHandler)
    socket.on("stream:stop", stopTransmissionHandler)

    return () => {
      socket.removeListener("stream:start", startTransmissionHandler)
      socket.removeListener("stream:join", joinTransmissionHandler)
      socket.removeListener("stream:leave", leaveTransmissionHandler)
      socket.removeListener("stream:stop", stopTransmissionHandler)
    }
  }, [socket])

  return {
    transmissions,
    startTransmission,
    stopTransmission,
    joinTransmission,
    leaveTransmission,
    ...publicMethods,
  }
}
