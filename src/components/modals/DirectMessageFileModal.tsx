"use client"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import FileUpload from "@/components/custom/FileUpload"
import Button from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form"
import useModal from "@/hooks/useModal/useModal"
import { createDirectMsg } from "@/actions/directMessageActions"
import useSocket from "@/hooks/useSocket/useSocket"

const formSchema = z.object({
  fileUrl: z.string().url("Server image url is invalid"),
})

type MessageFileInputs = z.infer<typeof formSchema>

export default function DirectMessageFileModal() {
  const { close, isOpen, data, type } = useModal()
  const { socket } = useSocket()
  const router = useRouter()
  const form = useForm<MessageFileInputs>({
    defaultValues: {
      fileUrl: "",
    },
    resolver: zodResolver(formSchema),
  })

  const { profile, conversation } = data
  const isModalOpen = isOpen && type === "DirectMessageFile"
  const isLoading = form.formState.isSubmitting

  const submitHandler = async ({ fileUrl }: MessageFileInputs) => {
    if (!profile || !conversation) return
    const createdMessage = await createDirectMsg({
      content: "",
      profileId: profile?.id,
      conversationId: conversation?.id,
      fileUrl,
    })
    socket?.emit("message:create", { message: createdMessage })
    form.reset()
    router.refresh()
    close()
  }

  const uploadChannelFileHandler = (files: string[]) => {
    if (files.length === 0) return form.resetField("fileUrl")
    if (files.length === 1) {
      form.setValue("fileUrl", files[0])
      form.clearErrors("fileUrl")
    }
  }

  const closeModalHandler = () => {
    form.reset()
    close()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModalHandler}>
      <DialogContent className="bg-white text-stone-900">
        <DialogHeader>
          <DialogTitle className="text-indigo-600 text-4xl font-bold text-center">
            File Attachment
          </DialogTitle>
          <DialogDescription className="py-4 text-stone-500">
            Send a file as a message.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="fileUrl"
              render={() => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      endpoint="messageFile"
                      onChange={uploadChannelFileHandler}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                variant="primary"
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
