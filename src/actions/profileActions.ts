/* eslint-disable import/no-anonymous-default-export */
"use server"
import db from "@/config/db"
import { currentUser, redirectToSignIn } from "@clerk/nextjs"
import type { Profile } from "../../prisma/output"
import type { Omit } from "../../prisma/output/runtime/library"

type ProfileInput = Omit<Profile, "id" | "createdAt" | "updatedAt">

export async function createInitialProfile(): Promise<Profile | null> {
  try {
    const user = await currentUser()

    if (!user) {
      return redirectToSignIn()
    }

    const email = user.emailAddresses[0].emailAddress
    const isProfileExists = await findProfileByEmail(email)

    if (isProfileExists) {
      return isProfileExists
    }

    const profile = await db.profile.create({
      data: {
        id: user.id,
        email,
        username: user.username || email.split("@")[0],
        imgUrl: user.imageUrl,
      },
    })

    return profile
  } catch (error) {
    return null
  }
}

export async function createProfile(
  input: ProfileInput
): Promise<Profile | null> {
  try {
    return await db.profile.create({
      data: input,
    })
  } catch (error) {
    return null
  }
}

export async function findProfileByEmail(
  email: string
): Promise<Profile | null> {
  try {
    return await db.profile.findUnique({ where: { email } })
  } catch (error) {
    return null
  }
}

export async function findProfileByUsername(
  username: string
): Promise<Profile | null> {
  try {
    return await db.profile.findUnique({ where: { username } })
  } catch (error) {
    return null
  }
}

export async function getCurrentProfile() {
  try {
    const user = await currentUser()
    if (!user) return null
    return await db.profile.findUnique({ where: { id: user.id } })
  } catch (error) {
    return null
  }
}

export async function getProfileById(id: string): Promise<Profile | null> {
  try {
    return await db.profile.findUnique({ where: { id } })
  } catch (error) {
    return null
  }
}
