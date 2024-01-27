import { useEffect, useState } from "react"
import { Profile } from "../../prisma/output"
import useSocket from "./useSocket/useSocket"
import { SocketFn } from "@/types/Socket"
import { ConversationWithProfiles } from "@/types/ConversationWithProfiles"

type Call = {
  conversation: ConversationWithProfiles
  caller: Profile
  called: Profile
}

type CallActionInput = {
  conversation: ConversationWithProfiles
  caller: Profile
  called: Profile
}

export default function useCall() {
  const { socket } = useSocket()
  const [calls, setCalls] = useState<Call[]>([])
  const [goingCalls, setGoingCalls] = useState<Call[]>([])

  const startCall = (input: CallActionInput) => {
    socket?.emit("call:start", input)
  }

  const stopCall = (input: CallActionInput) => {
    socket?.emit("call:stop", input)
  }

  const joinCall = (input: CallActionInput) => {
    socket?.emit("call:join", input)
  }

  const leaveCall = (input: CallActionInput) => {
    socket?.emit("call:leave", input)
  }

  const addGoingCall = ({ conversation, caller, called }: CallActionInput) => {
    setGoingCalls((currCalls) => {
      const isCallExists = currCalls.find(
        (call) => call.called.id === called.id && call.caller.id === caller.id,
      )

      if (isCallExists) return currCalls
      return [...currCalls, { conversation, called, caller }]
    })
  }

  const removeGoingCall = ({
    conversation,
    caller,
    called,
  }: CallActionInput) => {
    setGoingCalls((currCalls) => {
      const updatedCalls = currCalls.filter(
        (call) =>
          call.conversation.id === conversation.id &&
          call.called.id !== called.id &&
          call.caller.id !== caller.id,
      )
      return updatedCalls
    })
  }

  const addCall = ({ conversation, caller, called }: CallActionInput) => {
    setCalls((currCalls) => {
      const isCallExists = currCalls.find(
        (call) => call.called.id === called.id && call.caller.id === caller.id,
      )

      if (isCallExists) return currCalls
      return [...currCalls, { conversation, called, caller }]
    })
  }

  const removeCall = ({ conversation, caller, called }: CallActionInput) => {
    setCalls((currCalls) => {
      const updatedCalls = currCalls.filter(
        (call) =>
          call.conversation.id === conversation.id &&
          call.called.id !== called.id &&
          call.caller.id !== caller.id,
      )
      return updatedCalls
    })
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
          removeGoingCall({ conversation, called, caller })
        }
      })
    }

    const goingCallHandler: SocketFn = ({ conversation, called, caller }) => {
      console.log("going on event...")
      if (!called || !caller || !conversation) return
      addGoingCall({ conversation, called, caller })
    }

    const joinCallHandler: SocketFn = ({ conversation, called, caller }) => {
      if (!called || !caller || !conversation) return
      addCall({ conversation, called, caller })
      removeGoingCall({ conversation, called, caller })
      socket.emit("call:stop", { conversation })
    }

    const leavelCallHandler: SocketFn = ({ conversation, called, caller }) => {
      if (!called || !caller || !conversation) return
      removeCall({ conversation, called, caller })
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

  return { socket, calls, goingCalls, startCall, stopCall, joinCall, leaveCall }
}
