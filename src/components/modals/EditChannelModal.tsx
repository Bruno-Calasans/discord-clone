/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import * as z from "zod"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form"
import useModal from "@/hooks/useModal/useModal"
import { useRouter } from "next/navigation"
import { CHANNEL_TYPE } from "../../../prisma/output"
import { updateChannel } from "@/actions/channelActions"
import { useEffect } from "react"

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Channel name must have 3 or more characters long.")
    .refine((name) => name.toLowerCase() !== "general", {
      message: 'Channel name cannot be "general"',
    }),
  type: z.nativeEnum(CHANNEL_TYPE),
})

type EditChannelFormInputs = z.infer<typeof formSchema>

export default function EditChannelModal() {
  const { isOpen, type, data, close } = useModal()
  const { channel } = data

  const router = useRouter()
  const form = useForm<EditChannelFormInputs>({
    defaultValues: {
      name: channel?.name,
      type: channel?.type,
    },
    resolver: zodResolver(formSchema),
  })

  const isLoading = form.formState.isSubmitting
  const isModalOpen = isOpen && type === "EditChannel"

  const submitHandler = async (inputs: EditChannelFormInputs) => {
    if (!channel) return
    await updateChannel({
      channelId: channel.id,
      inputs,
    })
    form.reset()
    router.refresh()
    close()
  }

  const closeModalHandler = () => {
    form.reset()
    close()
  }

  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name)
      form.setValue("type", channel.type)
    }
  }, [channel?.name, channel?.type])

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModalHandler}>
      <DialogContent className="bg-white text-stone-900">
        <DialogHeader>
          <DialogTitle className="text-center text-4xl font-bold text-indigo-600">
            Edit your channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold uppercase">
                    Channel Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-zinc-100"
                      placeholder="Enter the channel name"
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold uppercase">
                    Channel Type
                  </FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full bg-zinc-100 font-semibold capitalize">
                        <SelectValue className="bg-white" />
                      </SelectTrigger>
                      <SelectContent className="bg-white font-semibold text-zinc-900">
                        {Object.values(CHANNEL_TYPE).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
