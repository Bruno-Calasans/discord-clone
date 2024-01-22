/* eslint-disable import/no-anonymous-default-export */
import { generateComponents } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>()
