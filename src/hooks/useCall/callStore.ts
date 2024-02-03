import { ConversationWithProfiles } from "@/types/ConversationWithProfiles"
import { create } from "zustand"
import { Profile } from "../../../prisma/output"

export type Call = {
  conversation: ConversationWithProfiles
  caller: Profile
  called: Profile
}

export type CallActionInput = {
  conversation: ConversationWithProfiles
  caller: Profile
  called: Profile
}

export type CallStoreState = {
  calls: Call[]
  goingCalls: Call[]
}

export type CallStoreActions = {
  addCall: (input: CallActionInput) => void
  removeCall: (conversationId: string) => void
  addGoingCall: (input: CallActionInput) => void
  removeGoingCall: (conversationId: string) => void
  getCall: (conversationId: string) => Call | undefined
  getGoingCall: (conversationId: string) => Call | undefined
}

export type CallStore = CallStoreState & CallStoreActions

const callStore = create<CallStore>((set, get) => ({
  calls: [],
  goingCalls: [],
  addCall({ conversation, caller, called }) {
    const { calls } = get()
    const isCallExists = calls.find(
      (call) => call.called.id === called.id && call.caller.id === caller.id,
    )

    if (isCallExists) return

    return set(() => ({
      calls: [...calls, { conversation, called, caller }],
    }))
  },
  addGoingCall({ conversation, caller, called }) {
    const { goingCalls } = get()

    const isGoingCallExists = goingCalls.find(
      (call) => call.called.id === called.id && call.caller.id === caller.id,
    )

    if (isGoingCallExists) return

    return set(() => ({
      goingCalls: [...goingCalls, { conversation, called, caller }],
    }))
  },
  removeCall(conversationId) {
    const { calls } = get()
    const updatedCalls = calls.filter(
      (call) => call.conversation.id !== conversationId,
    )
    return set(() => ({
      calls: updatedCalls,
    }))
  },
  removeGoingCall(conversationId) {
    const { goingCalls } = get()

    const updatedGoingCalls = goingCalls.filter(
      (call) => call.conversation.id !== conversationId,
    )

    return set(() => ({
      goingCalls: updatedGoingCalls,
    }))
  },
  getCall(conversationId) {
    const { calls } = get()
    return calls.find((call) => call.conversation.id === conversationId)
  },
  getGoingCall(conversationId) {
    const { goingCalls } = get()
    return goingCalls.find((call) => call.conversation.id === conversationId)
  },
}))

export default callStore
