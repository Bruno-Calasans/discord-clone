/* eslint-disable import/no-anonymous-default-export */
import db from "@/config/db"
import { currentUser, redirectToSignIn } from "@clerk/nextjs"
import type { Server } from "../../prisma/output"
import type { Omit } from "../../prisma/output/runtime/library"

type ServerInput = Omit<Server, "id" | "createdAt" | "updatedAt">

export async function getServersByProfileId(
  profileId: string
): Promise<Server[] | null> {
  try {
    return db.server.findMany({
      where: {
        members: {
          some: {
            profileId,
          },
        },
      },
    })
  } catch (error) {
    return null
  }
}
