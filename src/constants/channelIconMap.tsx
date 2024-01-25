import { Hash, Mic, Video } from "lucide-react"
import { CHANNEL_TYPE } from "../../prisma/output"

const CHANNEL_ICON_MAP = {
  [CHANNEL_TYPE.TEXT]: <Hash className="h-4 w-4" />,
  [CHANNEL_TYPE.AUDIO]: <Mic className="h-4 w-4" />,
  [CHANNEL_TYPE.VIDEO]: <Video className="h-4 w-4" />,
} as const
export default CHANNEL_ICON_MAP
