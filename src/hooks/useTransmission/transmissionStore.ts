import { Participant } from "livekit-client"
import { create } from "zustand"

export type Transmission = {
  streamer: Participant
  viewers: Participant[]
}

export type TransmissionStoreState = {
  transmissions: Transmission[]
}

export type TransmissionStoreActions = {
  addStreamer: (streamer: Participant) => void
  removeStreamer: (streamer: Participant) => void
  addViewer: (streamer: Participant, viewer: Participant) => void
  removeViewer: (streamer: Participant, viewer: Participant) => void
  getStreamer: (streamer: Participant) => Participant | undefined
  getViewer: (viewer: Participant) => Participant | undefined
  getStreamerViewers: (streamer: Participant) => Participant[] | undefined
  getTransmissionByStreamer: (streamer: Participant) => Transmission | undefined
  getTransmissionByViewer: (viewer: Participant) => Transmission | undefined
}

export type TransmissionStore = TransmissionStoreState &
  TransmissionStoreActions

const transmisionStore = create<TransmissionStore>((set, get) => ({
  transmissions: [],
  addStreamer(streamer) {
    const { transmissions } = get()
    const foundstreamer = transmissions.find(
      (p) => p.streamer.identity === streamer.identity,
    )

    if (foundstreamer) return

    const updatedTransmissions = [...transmissions, { streamer, viewers: [] }]

    set(() => ({
      transmissions: updatedTransmissions,
    }))
  },
  removeStreamer(streamer) {
    const { transmissions } = get()
    const updatedTransmissions = transmissions.filter(
      (p) => p.streamer.identity !== streamer.identity,
    )
    set(() => ({ transmissions: updatedTransmissions }))
  },
  addViewer(streamer, viewer) {
    const { transmissions } = get()

    if (streamer.identity === viewer.identity) return

    const foundTransmission = transmissions.find(
      (v) => v.streamer.identity === streamer.identity,
    )

    if (!foundTransmission) return

    const updatedTransmissions = transmissions.filter(
      (v) => v.streamer.identity !== streamer.identity,
    )

    const updatedViewer = foundTransmission.viewers.filter(
      (v) => v.identity !== viewer.identity,
    )

    set(() => ({
      transmissions: [
        ...updatedTransmissions,
        {
          streamer,
          viewers: [...updatedViewer, viewer],
        },
      ],
    }))

    return
  },
  removeViewer(streamer, viewer) {
    const { transmissions } = get()

    const foundTransmission = transmissions.find(
      (v) => v.streamer.identity === streamer.identity,
    )

    if (!foundTransmission) return

    const updatedTransmissions = transmissions.filter(
      (v) => v.streamer.identity !== streamer.identity,
    )

    const updatedViewers = foundTransmission.viewers.filter(
      (v) => v.identity !== viewer.identity,
    )

    set(() => ({
      transmissions: [
        ...updatedTransmissions,
        {
          streamer,
          viewers: updatedViewers,
        },
      ],
    }))
  },
  getStreamer(streamer) {
    const { transmissions } = get()
    for (let transmission of transmissions) {
      if (transmission.streamer.identity === streamer.identity) {
        return transmission.streamer
      }
    }
  },
  getViewer(viewer) {
    const { transmissions } = get()

    for (let transmission of transmissions) {
      const foundViewer = transmission.viewers.find(
        (v) => v.identity === viewer.identity,
      )
      if (foundViewer) {
        return foundViewer
      }
    }
  },
  getStreamerViewers(streamer) {
    const foundTransmission = get().getTransmissionByStreamer(streamer)

    if (!foundTransmission) return
    return foundTransmission.viewers
  },
  getTransmissionByStreamer(streamer) {
    const { transmissions } = get()
    return transmissions.find((t) => t.streamer.identity === streamer.identity)
  },
  getTransmissionByViewer(viewer) {
    const { transmissions } = get()

    for (let transmission of transmissions) {
      const foundViewer = transmission.viewers.find(
        (t) => t.identity === viewer.identity,
      )
      if (foundViewer) {
        return transmission
      }
    }
  },
}))

export default transmisionStore
