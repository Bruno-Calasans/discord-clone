"use client"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/Form"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { Plus } from "lucide-react"
import useSocket from "@/hooks/useSocket/useSocket"
import useModal from "@/hooks/useModal/useModal"
import EmojiPicker, { Emoji } from "./EmojiPicker"
import { useRouter } from "next/navigation"
import { ConversationWithProfiles } from "@/types/ConversationWithProfiles"
import { Profile } from "../../../prisma/output"
import { createDirectMsg } from "@/actions/directMessageActions"

const chatInputSchema = z.object({
  content: z
    .string()
    .min(1, "Message content must have at least 1 character long"),
})

type ChatInputFormInputs = z.infer<typeof chatInputSchema>

type ChatDmInputProps = {
  conversation: ConversationWithProfiles
  currentProfile: Profile
  otherProfile: Profile
}

export default function ChatDmInput({
  conversation,
  currentProfile,
  otherProfile,
}: ChatDmInputProps) {
  const { open } = useModal()
  const { socket } = useSocket()
  const router = useRouter()

  const form = useForm<ChatInputFormInputs>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(chatInputSchema),
  })

  const loading = form.formState.isLoading

  const submitHandler = async ({ content }: ChatInputFormInputs) => {
    const message = await createDirectMsg({
      content,
      profileId: currentProfile.id,
      conversationId: conversation.id,
    })
    if (!message) return
    socket?.emit("message:create", { message } as any)
    form.reset()
    router.refresh()
  }

  const attachFileHandler = () => {
    open("DirectMessageFile", { conversation, profile: currentProfile })
  }

  const selecEmojiHandler = (emoji: Emoji) => {
    const currentContent = form.getValues("content")
    form.setValue("content", `${currentContent}${emoji.native}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-8">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="mx-2 mb-2 flex items-center gap-2 rounded-sm bg-zinc-300 p-1  px-2 dark:bg-zinc-700">
                  <Button
                    onClick={attachFileHandler}
                    type="button"
                    size="icon"
                    className="h-[24px] w-[24px] rounded-full bg-zinc-600 p-1 text-zinc-100 transition hover:bg-zinc-900 hover:text-zinc-200 dark:bg-zinc-500 dark:text-zinc-800 hover:dark:bg-zinc-900 hover:dark:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Input
                    className="border-1 border-none  bg-zinc-300 font-semibold text-zinc-800 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700 dark:text-zinc-100"
                    placeholder={`Message ${otherProfile.username}`}
                    disabled={loading}
                    {...field}
                  />
                  <EmojiPicker onSelect={selecEmojiHandler} />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
