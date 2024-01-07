"use client"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/Form"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { Plus, Smile } from "lucide-react"
import { Channel } from "../../../prisma/output"
import { createChannelMessage } from "@/actions/messageActions"
import { MemberWithProfile } from "@/types/MemberProfile"
import useSocket from "@/hooks/useSocket/useSocket"

const chatInputSchema = z.object({
  content: z
    .string()
    .min(1, "Message content must have at least 1 character long"),
})

type ChatInputFormInputs = z.infer<typeof chatInputSchema>

type ChatInputProps = {
  channel: Channel
  member: MemberWithProfile
}

export default function ChatChannelInput({ channel, member }: ChatInputProps) {
  const { socket } = useSocket()

  const form = useForm<ChatInputFormInputs>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(chatInputSchema),
  })

  const loading = form.formState.isLoading

  const submitHandler = async ({ content }: ChatInputFormInputs) => {
    const message = await createChannelMessage({
      content,
      channelId: channel.id,
      memberId: member.id,
    })
    if (!message) return

    form.resetField("content")
    socket?.emit("send-channel-msg", message)
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
                <div className="flex items-center gap-2 p-1 px-2 bg-zinc-300 dark:bg-zinc-700 rounded-sm  mx-2 mb-2">
                  <Button
                    type="button"
                    size="icon"
                    className="text-zinc-100 dark:text-zinc-800 bg-zinc-600 hover:bg-zinc-900 hover:text-zinc-200 dark:bg-zinc-500 hover:dark:bg-zinc-900 hover:dark:text-white w-[24px] h-[24px] p-1 rounded-full transition"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Input
                    className="text-zinc-800 bg-zinc-300  dark:text-zinc-100 dark:bg-zinc-700 border-none border-1 focus-visible:ring-0 focus-visible:ring-offset-0 font-semibold shadow-sm"
                    placeholder={`Message #${channel.name}`}
                    disabled={loading}
                    {...field}
                  />
                  <button type="button">
                    <Smile className="hover:fill-yellow-500 hover:text-zinc-900" />
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
