"use client"
import "@uploadthing/react/styles.css"
import * as z from "zod"
import * as serverActions from "@/actions/serverActions"
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
import FileUpload from "../custom/FileUpload"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  name: z.string().min(3, "Server name must have 3 or more characters long."),
  imgUrl: z.string().url("Server image url is invalid"),
})

type CreateServerInputs = z.infer<typeof formSchema>

export default function InitialCreateServerModal() {
  const router = useRouter()
  const form = useForm<CreateServerInputs>({
    defaultValues: {
      name: "",
      imgUrl: "",
    },
    resolver: zodResolver(formSchema),
  })

  const isLoading = form.formState.isSubmitting

  const submitHandler = async (inputs: CreateServerInputs) => {
    const server = await serverActions.createServer(inputs)
    if (!server) return
    form.reset()
    router.refresh()
  }

  const uploadServerImageHandler = (urls: string[]) => {
    if (urls.length === 0) return form.resetField("imgUrl")
    form.setValue("imgUrl", urls[0])
    form.clearErrors("imgUrl")
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
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      endpoint="serverImg"
                      onChange={uploadServerImageHandler}
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
                  <FormLabel className="font-bold text-sm uppercase">
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
