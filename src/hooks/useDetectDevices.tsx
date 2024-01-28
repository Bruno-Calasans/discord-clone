import { useEffect, useState } from "react"

type AvaliableMediaDevices = {
  camera: boolean
  microphone: boolean
  playSound: boolean
}

export default function useDetectDevices() {
  const [devices, setDevices] = useState<AvaliableMediaDevices>({
    camera: false,
    microphone: false,
    playSound: false,
  })

  const detectDevices = async () => {
    const midias: AvaliableMediaDevices = {
      camera: false,
      microphone: false,
      playSound: false,
    }

    const devices = await navigator.mediaDevices.enumerateDevices()
    for (const device of devices) {
      if (device.kind === "videoinput") {
        midias.camera = true
      }

      if (device.kind === "audioinput") {
        midias.microphone = true
      }

      if (device.kind === "audiooutput") {
        midias.playSound = true
      }
    }

    setDevices(midias)
  }

  useEffect(() => {
    detectDevices()
  }, [])

  return { devices, detectDevices }
}
