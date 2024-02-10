import Link from "next/link"
import Button from "@/components/ui/Button"
import { SearchX, Undo2 } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center">
        <SearchX className="h-24 w-24 " />
        <h2 className="text-5xl font-bold text-zinc-200">Not Found - 404</h2>
        <p className="text-zinc-500">We cannot find what are looking for :(</p>
      </div>
      <Link href="/">
        <Button variant="secondary" className="flex items-center gap-1">
          <Undo2 className="h-4 w-4" />
          Return home
        </Button>
      </Link>
    </div>
  )
}
