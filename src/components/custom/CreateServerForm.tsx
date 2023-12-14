"use client"
import "@uploadthing/react/styles.css"
import * as z from "zod"
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useState } from "react"
import { UploadDropzone } from "@/utils/uploadthing"
import { type UploadFileResponse } from "uploadthing/client"
import FileUpload from "./FileUpload"

const formSchema = z.object({
  name: z.string().min(3, "Server name must have 3 or more characters."),
  imgUrl: z.string().min(1, "Server image is required"),
})

type CreateServerInputs = z.infer<typeof formSchema>

type CreateServerFormProps = {
  onSubmit: (inputs: CreateServerInputs) => void
}

export default function CreateServerForm({ onSubmit }: CreateServerFormProps) {
  const [isMounted, setMounted] = useState(false)
  const form = useForm<CreateServerInputs>({
    defaultValues: {
      name: "",
      imgUrl: "",
    },
    resolver: zodResolver(formSchema),
  })

  const isLoading = form.formState.isSubmitting

  const submitHandler = (inputs: CreateServerInputs) => {
    onSubmit(inputs)
  }

  const fileUploadHandler = (urls: string[]) => {
    if (urls.length === 0) return form.resetField("imgUrl")
    form.setValue("imgUrl", urls[0])
    form.clearErrors("imgUrl")
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Dialog open>
      <DialogContent className="bg-white text-stone-900">
        <DialogHeader>
          <DialogTitle className="text-indigo-600 text-4xl font-bold text-center">
            Customize your Server
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
              render={() => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      endpoint="serverImg"
                      onChange={fileUploadHandler}
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
                  <FormLabel className="text-bold text-lg">
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
              <Button variant="primary" type="submit" disabled={isLoading}>
                Create Server
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
