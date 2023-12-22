"use client"
import { useState } from "react"
import { X } from "lucide-react"
import { OurFileRouter } from "@/app/api/uploadthing/core"
import { UploadDropzone } from "@/utils/uploadthing"
import { UploadFileResponse } from "uploadthing/client"
import Image from "next/image"

type UploadCompleteResponse = UploadFileResponse<null>[]

type FileUploadProps = {
  endpoint: keyof OurFileRouter
  defaultFiles?: string[]
  onChange: (files: string[]) => void
  onError?: (error: unknown) => void
}

function FileUpload({
  endpoint,
  defaultFiles = [],
  onChange,
  onError,
}: FileUploadProps) {
  const [files, setFiles] = useState<string[]>(defaultFiles)

  const uploadHandler = (responses: UploadCompleteResponse) => {
    const files = responses.map((response) => response.url)
    setFiles(files)
    onChange(files)
  }

  const clearFilesHandler = () => {
    setFiles([])
    onChange([])
  }

  // single file upload
  if (files.length === 1) {
    return (
      <div className="w-full flex justify-center">
        <div className="relative h-28 w-28">
          <Image
            fill
            alt="Server upload image"
            src={files[0]}
            className="rounded-full"
          />
          <button
            title="Remove image"
            onClick={clearFilesHandler}
            className="absolute  text-white bg-red-500 z-100000 right-0 top-0 rounded-full shadow-sm hover:bg-red-600"
          >
            <X />
          </button>
        </div>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      className="bg-zinc-300/30 rounded-sm"
      onClientUploadComplete={uploadHandler}
      onUploadError={onError}
    />
  )
}

export default FileUpload
