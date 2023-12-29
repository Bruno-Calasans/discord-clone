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
import { createChannel } from "@/actions/channelActions"
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

type CreateChannelFormInputs = z.infer<typeof formSchema>

export default function CreateChannelModal() {
  const { isOpen, type, data, close } = useModal()
  const { server, profile, channelType } = data

  const router = useRouter()
  const form = useForm<CreateChannelFormInputs>({
    defaultValues: {
      name: "",
      type: CHANNEL_TYPE.TEXT,
    },
    resolver: zodResolver(formSchema),
  })

  const isLoading = form.formState.isSubmitting
  const isModalOpen = isOpen && type === "CreateChannel"

  const submitHandler = async (inputs: CreateChannelFormInputs) => {
    if (!server || !profile) return
    await createChannel({
      ...inputs,
      serverId: server.id,
      profileId: profile.id,
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
    if (channelType) {
      form.setValue("type", channelType)
    }
  }, [channelType])

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModalHandler}>
      <DialogContent className="bg-white text-stone-900">
        <DialogHeader>
          <DialogTitle className="text-indigo-600 text-4xl font-bold text-center">
            Create you channel
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
                  <FormLabel className="font-bold text-sm uppercase">
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
                  <FormLabel className="font-bold text-sm uppercase">
                    Channel Type
                  </FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="font-semibold w-full bg-zinc-100 capitalize">
                        <SelectValue className="bg-white" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-zinc-900 font-semibold">
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
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
