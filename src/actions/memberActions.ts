"use server"
import db from "@/config/db"
import type { Member } from "../../prisma/output"

export async function getMemberByProfileId(profileId: string) {}

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
    console.log(error)
    return null
  }
}

export async function kickMember(memberId: string) {
  try {
    return await db.member.delete({
      where: {
        id: memberId,
      },
    })
  } catch (error) {
    return null
  }
}
