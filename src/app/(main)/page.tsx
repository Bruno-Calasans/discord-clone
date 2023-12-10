import { UserButton } from "@clerk/nextjs"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <div>DISCORD CLONE</div>
      <UserButton afterSignOutUrl="/" showName />
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
