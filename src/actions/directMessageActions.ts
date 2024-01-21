"use server";
import db from "@/config/db";
import {
  findConversationById,
  getConversationById,
  getConversationByProfileId,
} from "./conversationActions";
import { getProfileById } from "./profileActions";
import { DirectMessage } from "../../prisma/output";
import { DmWithProfileConversation } from "@/types/DmWithProfileConversation";

type CreateDmMessageInputs = {
  content: string;
  profileId: string;
  conversationId: string;
  fileUrl?: string;
};

type GetDirectMsgsInputs = {
  conversationId: string;
  cursor: string;
  batch: number;
};

type EditDmInputs = {
  messageId: string;
  profileId: string;
  content: string;
};

type DeleteDirectMsgInputs = {
  messageId: string;
  profileId: string;
  conversationId: string;
};

export async function createDirectMsg({
  content,
  conversationId,
  profileId,
  fileUrl,
}: CreateDmMessageInputs) {
  try {
    const conversation = await findConversationById(conversationId);
    if (!conversation) throw new Error("Conversation not Found");

    const profile = await getProfileById(profileId);
    if (!profile) throw new Error("Profile not Found");

    return await db.directMessage.create({
      data: {
        content,
        fileUrl,
        profileId,
        conversationId,
      },
      include: {
        profile: true,
        conversation: {
          include: {
            senderProfile: true,
            receiverProfile: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
}

export async function getDirectMsgs({
  conversationId,
  batch,
  cursor,
}: GetDirectMsgsInputs) {
  try {
    const conversation = await getConversationById(conversationId);
    if (!conversation) throw new Error("Conversation not Found");

    let messages: DmWithProfileConversation[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        where: {
          conversationId,
        },
        include: {
          profile: true,
          conversation: {
            include: {
              senderProfile: true,
              receiverProfile: true,
            },
          },
        },
        take: batch,
        skip: 1,
        cursor: {
          id: cursor,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.directMessage.findMany({
        where: {
          conversationId,
        },
        include: {
          profile: true,
          conversation: {
            include: {
              senderProfile: true,
              receiverProfile: true,
            },
          },
        },
        take: batch,
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;
    if (messages && messages.length === batch) {
      nextCursor = messages[batch - 1].id;
    }
    return { messages, nextCursor };
  } catch (error) {
    return null;
  }
}

export async function getDirectMsgById(messageId: string) {
  try {
    return db.directMessage.findUnique({
      where: {
        id: messageId,
      },
    });
  } catch (error) {
    return null;
  }
}

export async function editDirectMsg({
  messageId,
  content,
  profileId,
}: EditDmInputs) {
  try {
    const message = await getDirectMsgById(messageId);
    if (!message) {
      throw new Error("Channel message not found");
    }

    if (message.deleted) {
      throw new Error("Message is deleted");
    }

    const isMessageOwner = message.profileId === profileId;
    if (!isMessageOwner) {
      throw new Error("You cannot edit other member's message");
    }

    const profile = await getProfileById(profileId);
    if (!profile) {
      throw new Error("Profile not found");
    }

    return await db.directMessage.update({
      where: {
        id: messageId,
        profileId,
      },
      data: { content },
      include: {
        profile: true,
        conversation: true,
      },
    });
  } catch (error) {
    return null;
  }
}

export async function deleteDirectMsg({
  messageId,
  conversationId,
  profileId,
}: DeleteDirectMsgInputs) {
  try {
    const message = await getDirectMsgById(messageId);
    if (!message) {
      throw new Error("Direct message not found");
    }

    if (message.deleted) {
      throw new Error("Message is already deleted");
    }

    const isMessageOwner = message.profileId === profileId;
    if (!isMessageOwner) {
      throw new Error("You cannot delete other profile's message");
    }

    const profile = await getProfileById(profileId);
    if (!profile) {
      throw new Error("Profile not found");
    }

    const conversation = await getConversationByProfileId({
      conversationId,
      profileId,
    });
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    return await db.directMessage.update({
      where: {
        id: messageId,
        profileId,
        conversationId,
      },
      data: { deleted: true, content: "This message has been deleted." },
      include: {
        conversation: {
          include: {
            senderProfile: true,
            receiverProfile: true,
          },
        },
        profile: true,
      },
    });
  } catch (error) {
    return null;
  }
}
