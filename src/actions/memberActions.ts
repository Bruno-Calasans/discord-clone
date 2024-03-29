"use server"
import db from "@/config/db"
import { getCurrentProfile } from "./profileActions"

export async function getMemberById(memberId: string) {
  try {
    return await db.member.findUnique({
      where: {
        id: memberId,
      },
    })
  } catch (error) {
    return null
  }
}

export async function changeMemberRole(memberId: string, role: string) {
  try {
    return await db.member.update({
      where: {
        id: memberId,
      },
      data: {
        role,
      },
    })
  } catch (error) {
    return null
  }
}

export async function kickMember(memberId: string) {
  try {
    const profile = await getCurrentProfile()
    if (!profile) throw new Error("Profile not found")

    return await db.member.delete({
      where: {
        id: memberId,
        NOT: {
          profileId: profile.id,
        },
      },
    })
  } catch (error) {
    return null
  }
}

export async function banMember(memberId: string) {
  try {
    const profile = await getCurrentProfile()
    if (!profile) throw new Error("Profile not found")

    return await db.member.delete({
      where: {
        id: memberId,
        NOT: {
          profileId: profile.id,
        },
      },
    })
  } catch (error) {
    return null
  }
}
