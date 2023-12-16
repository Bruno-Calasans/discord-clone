import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"

type ActionTooltipProps = {
  label: string
  children: React.ReactNode
  align?: "center" | "start" | "end"
  side?: "right" | "left" | "top" | "bottom"
}

function ActionTooltip({ children, label, align, side }: ActionTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent align={align} side={side}>
          <p className="text-white font-semibold capitalize">
            {label.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default ActionTooltip
