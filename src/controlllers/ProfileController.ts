/* eslint-disable import/no-anonymous-default-export */
import db from "@/config/db"
import { currentUser, redirectToSignIn } from "@clerk/nextjs"
import type { Profile } from "../../prisma/output"
import type { Omit } from "../../prisma/output/runtime/library"

type ProfileInput = Omit<Profile, "id" | "createdAt" | "updatedAt">

export default function profileController() {
  return {
    async createInitialProfile(): Promise<Profile | null> {
      try {
        const user = await currentUser()

        if (!user) {
          return redirectToSignIn()
        }

        const email = user.emailAddresses[0].emailAddress
        const isProfileExists = await this.findByEmail(email)

        if (isProfileExists) {
          return isProfileExists
        }

        const profile = await this.create({
          email,
          username: user.username || email.split("@")[0],
          imgUrl: user.imageUrl,
        })

        return profile
      } catch (error) {
        return null
      }
    },

    async create(profile: ProfileInput): Promise<Profile | null> {
      try {
        return await db.profile.create({
          data: {
            ...profile,
          },
        })
      } catch (error) {
        return null
      }
    },

    async findByEmail(email: string): Promise<Profile | null> {
      try {
        return await db.profile.findUnique({ where: { email } })
      } catch (error) {
        return null
      }
    },

    async findByUsername(username: string): Promise<Profile | null> {
      try {
        return await db.profile.findUnique({ where: { username } })
      } catch (error) {
        return null
      }
    },
  }
}
