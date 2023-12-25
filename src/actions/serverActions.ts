/* eslint-disable import/no-anonymous-default-export */
"use server"
import db from "@/config/db"
import type { Server, Channel } from "../../prisma/output"
import type { Omit } from "../../prisma/output/runtime/library"
import { getCurrentProfile, getProfileById } from "@/actions/profileActions"
import { v4 } from "uuid"
import { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"

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

export async function updateServer(
  serverId: string,
  inputs: Partial<ServerInput>
) {
  try {
    return await db.server.update({
      where: {
        id: serverId,
      },
      data: inputs,
    })
  } catch (error) {}
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

export async function getServerChannels(
  serverId: string
): Promise<Channel[] | null> {
  try {
    return await db.channel.findMany({
      where: {
        serverId,
      },
      orderBy: {
        name: "asc",
      },
    })
  } catch (error) {
    return null
  }
}

export async function getServerMembers(serverId: string) {
  try {
    return await db.member.findMany({
      where: {
        serverId,
      },
      orderBy: {
        role: "asc",
      },
      include: {
        profile: true,
      },
    })
  } catch (error) {
    return null
  }
}

export async function getCompleteServer(serverId: string) {
  try {
    return (await db.server.findUnique({
      where: {
        id: serverId,
      },
      include: {
        profile: true,
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
        channels: true,
      },
    })) as unknown as ServerWithMembersAndProfile
  } catch (error) {
    return null
  }
}

export async function regenerateServerInviteCode(serverId: string) {
  try {
    return await db.server.update({
      where: {
        id: serverId,
      },
      data: {
        inviteCode: v4(),
      },
    })
  } catch (error) {
    return null
  }
}

export async function joinServer(serverId: string, profileId: string) {
  try {
    const profile = await getProfileById(profileId)
    if (!profile) throw new Error("Profile not found")

    return await db.server.update({
      where: {
        id: serverId,
      },
      data: {
        members: {
          create: {
            name: profile.username,
            profileId: profile.id,
            role: "guest",
          },
        },
      },
    })
  } catch (error) {
    return null
  }
}

export async function getServerByInviteCode(inviteCode: string) {
  try {
    return await db.server.findFirst({
      where: {
        inviteCode,
      },
    })
  } catch (error) {
    return null
  }
}
