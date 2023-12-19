/* eslint-disable import/no-anonymous-default-export */
"use server"
import db from "@/config/db"
import type { Server } from "../../prisma/output"
import type { Omit } from "../../prisma/output/runtime/library"
import { getCurrentProfile } from "@/actions/profileActions"
import { v4 } from "uuid"

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

export async function createServer(
  input: Omit<ServerInput, "inviteCode" | "profileId">
) {
  try {
    const profile = await getCurrentProfile()
    if (!profile) return null

    return db.server.create({
      data: {
        ...input,
        profileId: profile.id,
        inviteCode: v4(),
        // initial channels
        channels: {
          create: [
            {
              name: "general",
              type: "TEXT",
              profileId: profile.id,
            },
          ],
        },
        // initial members
        members: {
          create: [
            {
              name: profile.username,
              profileId: profile.id,
              role: "admin",
            },
          ],
        },
      },
    })
  } catch (error) {
    return null
  }
}

export async function getServerById(serverId: string): Promise<Server | null> {
  try {
    return db.server.findUnique({
      where: {
        id: serverId,
      },
    })
  } catch (error) {
    return null
  }
}

export async function getServers(): Promise<Server[] | null> {
  try {
    return db.server.findMany()
  } catch (error) {
    return null
  }
}
