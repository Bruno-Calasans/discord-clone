import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { cn } from "@/utils/cn"

type ActionTooltipProps = {
  label: string
  children: React.ReactNode
  align?: "center" | "start" | "end"
  side?: "right" | "left" | "top" | "bottom"
  sideOffSet?: number
}

function ActionTooltip({
  children,
  label,
  align,
  side,
  sideOffSet = 6,
}: ActionTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          align={align}
          side={side}
          sideOffset={sideOffSet}
          className="bg-black"
        >
          <p className="text-white font-semibold capitalize dark:text-white">
            {label.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default ActionTooltip
