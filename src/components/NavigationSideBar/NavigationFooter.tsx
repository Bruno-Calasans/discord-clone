import { UserButton } from "@clerk/nextjs"
import ModeToggle from "../ui/ModeToggle"
import { cn } from "@/utils/cn"

type NavigationFooterProps = {
  classname?: string
}

export default function NavigationFooter({ classname }: NavigationFooterProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 justify-center items-center",
        classname
      )}
    >
      <ModeToggle />
      <UserButton />
    </div>
  )
}
