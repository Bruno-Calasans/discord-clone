import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import ModeToggle from "@/components/ui/ModeToggle"

export default function Home() {
  return (
    <>
      <div>DISCORD CLONE</div>
      <div className="">
        <ModeToggle />
        <UserButton afterSignOutUrl="/" showName />
      </div>
      <ul className="flex gap-2">
        <li>
          <Link href="/sign-in">Sign-In</Link>
        </li>
        <li>
          <Link href="/sign-up">Sign-Up</Link>
        </li>
      </ul>
    </>
  )
}
