"use client"
import "@uploadthing/react/styles.css"
import * as z from "zod"
import { updateServer } from "@/actions/serverActions"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
  FormLabel,
  FormMessage,
} from "@/components/ui/Form"
import FileUpload from "@/components/custom/FileUpload"
import useModal from "@/hooks/useModal/useModal"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Your server name must have 3 or more characters long."),
  imgUrl: z.string().url("Your server must have an image."),
})

type EditServerInputs = z.infer<typeof formSchema>

export default function EditServerModal() {
  const { isOpen, type, data, close } = useModal()
  const router = useRouter()
  const form = useForm<EditServerInputs>({
    defaultValues: {
      name: "",
      imgUrl: "",
    },
    resolver: zodResolver(formSchema),
  })

  const isLoading = form.formState.isSubmitting
  const isModalOpen = isOpen && type === "EditServer"
  const { server } = data

  const submitHandler = async (inputs: EditServerInputs) => {
    if (!server) return
    await updateServer(server.id, inputs)
    router.refresh()
    form.reset()
    close()
  }

  const uploadServerImageHandler = (files: string[]) => {
    if (files.length === 0) return form.resetField("imgUrl")
    if (files.length === 1) {
      form.setValue("imgUrl", files[0])
      form.clearErrors("imgUrl")
    }
  }

  const closeModalHandler = () => {
    form.reset()
    close()
  }

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name)
      form.setValue("imgUrl", server.imgUrl)
    }
  }, [form, server, data])

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModalHandler}>
      <DialogContent className="bg-white text-stone-900">
        <DialogHeader>
          <DialogTitle className="text-center text-4xl font-bold text-indigo-600">
            Edit your Server
          </DialogTitle>
          <DialogDescription className="py-4 text-stone-500">
            Choose your server name and image to better show your personality.
            You can change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="imgUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      endpoint="serverImg"
                      onChange={uploadServerImageHandler}
                      defaultFiles={[field.value]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold uppercase">
                    Server Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-zinc-300/30"
                      placeholder="Enter server name"
                      {...field}
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
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
