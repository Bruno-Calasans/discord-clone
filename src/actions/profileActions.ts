/* eslint-disable import/no-anonymous-default-export */
"use server"
import db from "@/config/db"
import { currentUser } from "@clerk/nextjs"
import type { Profile } from "../../prisma/output"
import type { Omit } from "../../prisma/output/runtime/library"

type ProfileInput = Omit<Profile, "id" | "createdAt" | "updatedAt">

export async function createInitialProfile(): Promise<Profile | null> {
  try {
    // getting current user
    const user = await currentUser()
    if (!user) throw new Error("User not found")

    const email = user.emailAddresses[0].emailAddress
    const isProfileExists = await getProfileByEmail(email)

    if (isProfileExists) {
      return isProfileExists
    }

    let username = ""

    if (user.firstName && user.lastName) {
      username = `${user.firstName} ${user.lastName}`
    } else if (user.username) {
      username = user.username
    } else {
      username = email.split("@")[0]
    }

    const profile = await db.profile.create({
      data: {
        id: user.id,
        email,
        username,
        imgUrl: user.imageUrl,
      },
    })

    return profile
  } catch (error) {
    return null
  }
}

export async function createProfile(
  input: ProfileInput,
): Promise<Profile | null> {
  try {
    return await db.profile.create({
      data: input,
    })
  } catch (error) {
    return null
  }
}

export async function getProfileByEmail(
  email: string,
): Promise<Profile | null> {
  try {
    return await db.profile.findUnique({ where: { email } })
  } catch (error) {
    return null
  }
}

export async function getProfileByUsername(
  username: string,
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
