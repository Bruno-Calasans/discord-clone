import { SignIn } from "@clerk/nextjs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign-In",
}

function SignInPage() {
  return <SignIn />
}

export default SignInPage
