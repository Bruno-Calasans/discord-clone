import { ShieldAlert } from "lucide-react"

const ICON_ROLE_MAP = {
  guest: null,
  admin: <ShieldAlert className="h-4 w-4 text-rose-500" />,
} as Record<string, React.ReactNode>

export default ICON_ROLE_MAP
