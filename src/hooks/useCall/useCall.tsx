import useSocket from "../useSocket/useSocket"
import { SocketFn } from "@/types/Socket"
import { ConversationWithProfiles } from "@/types/ConversationWithProfiles"
import { useStore } from "zustand"
import callStore, { CallActionInput } from "./callStore"
import { useEffect } from "react"

export default function useCall() {
  const { socket } = useSocket()
  const {
    calls,
    goingCalls,
    addCall,
    addGoingCall,
    removeCall,
    removeGoingCall,
    getCall,
    getGoingCall,
  } = useStore(callStore)

  const startCall = (input: CallActionInput) => {
    if (!socket) return
    socket.emit("call:start", input)
  }

  const stopCall = (input: CallActionInput) => {
    if (!socket) return
    socket.emit("call:stop", input)
  }

  const joinCall = (input: CallActionInput) => {
    if (!socket) return
    socket.emit("call:join", input)
  }

  const leaveCall = (conversation: ConversationWithProfiles) => {
    if (!socket) return
    socket.emit("call:leave", { conversation })
  }

  useEffect(() => {
    if (!socket) return

    const startCallHandler: SocketFn = ({ conversation, caller, called }) => {
      if (!called || !caller || !conversation) return

      const id = setInterval(() => {
        socket.emit("call:going", {
          conversation,
          called,
          caller,
        })
      }, 1000)

      socket.on("call:stop", ({ conversation: stopConversation }) => {
        if (stopConversation && stopConversation.id === conversation.id) {
          clearInterval(id)
          removeGoingCall(conversation.id)
        }
      })
    }

    const goingCallHandler: SocketFn = ({ conversation, called, caller }) => {
      if (!called || !caller || !conversation) return
      addGoingCall({ conversation, called, caller })
    }

    const joinCallHandler: SocketFn = ({ conversation, called, caller }) => {
      if (!called || !caller || !conversation) return
      addCall({ conversation, called, caller })
      removeGoingCall(conversation.id)
      socket.emit("call:stop", { conversation })
    }

    const leavelCallHandler: SocketFn = ({ conversation }) => {
      if (!conversation) return
      removeCall(conversation.id)
    }

    socket.on("call:start", startCallHandler)
    socket.on("call:going", goingCallHandler)
    socket.on("call:join", joinCallHandler)
    socket.on("call:leave", leavelCallHandler)

    return () => {
      socket.removeListener("call:start", startCallHandler)
      socket.removeListener("call:going", goingCallHandler)
      socket.removeListener("call:join", joinCallHandler)
      socket.removeListener("call:leave", leavelCallHandler)
    }
  }, [socket])

  return {
    calls,
    goingCalls,
    startCall,
    stopCall,
    joinCall,
    leaveCall,
    getGoingCall,
    getCall,
  }
}
