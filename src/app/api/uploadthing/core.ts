import { auth } from "@clerk/nextjs"
import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

const authHandler = () => {
  const { userId } = auth()
  if (!userId) throw new Error("No user")
  return { userId }
}

export const ourFileRouter = {
  serverImg: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(() => authHandler())
    .onUploadComplete(({ file, metadata }) => {}),
  messageFile: f(["image", "pdf"])
    .middleware(() => authHandler())
    .onUploadComplete(({ file, metadata }) => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
