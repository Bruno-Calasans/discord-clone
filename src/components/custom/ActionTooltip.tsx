import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { cn } from "@/utils/cn"
import { TooltipArrow } from "@radix-ui/react-tooltip"

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
          <TooltipArrow width={11} height={5} />
          <p className="font-semibold capitalize text-white dark:text-white">
            {label.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default ActionTooltip
