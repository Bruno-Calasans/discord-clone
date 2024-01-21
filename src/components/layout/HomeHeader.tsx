import Link from "next/link";
import ModeToggle from "@/components/ui/ModeToggle";
import Button from "@/components/ui/Button";

export default function HomeHeader() {
  return (
    <header className="flex justify-between bg-slate-800 p-5">
      <div className="text-lg font-bold text-indigo-500">
        <Link href="/">DISCORD CLONE</Link>
      </div>
      <div className="flex gap-2">
        <nav className="flex">
          <ul className="flex gap-3">
            <Link href="/sign-in">
              <Button variant="primary">Sign In</Button>
            </Link>

            <Link href="/sign-up">
              <Button variant="primary">Sign Up</Button>
            </Link>
          </ul>
        </nav>
        <ModeToggle />
      </div>
    </header>
  );
}
