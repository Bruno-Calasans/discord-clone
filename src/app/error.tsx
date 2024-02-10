"use client"

import Button from "@/components/ui/Button"
import { ServerCrash, RefreshCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const resetHandler = () => {
    reset()
  }

  return (
    <html className="h-full">
      <body className="h-full">
        <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-2">
          <div className="flex flex-col items-center gap-2">
            <ServerCrash className="h-24 w-24" />
            <h2 className="text-5xl font-bold dark:text-zinc-200">
              Ops! Something went wrong
            </h2>
            <p className="dark:text-zinc-500">
              Something unexpected have happened. We sorry :(
            </p>
          </div>

          <Button
            onClick={resetHandler}
            variant="secondary"
            className="flex items-center gap-1"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </body>
    </html>
  )
}
