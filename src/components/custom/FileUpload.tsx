"use client"
import { useEffect, useState } from "react"
import { X, File } from "lucide-react"
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

export default function FileUpload({
  endpoint,
  defaultFiles = [],
  onChange,
  onError,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadCompleteResponse>([])

  const uploadHandler = (response: UploadCompleteResponse) => {
    setFiles(response)
    onChange(files.map((file) => file.url))
  }

  const clearFilesHandler = () => {
    setFiles([])
    onChange([])
  }

  useEffect(() => {
    if (defaultFiles.length > 0) {
      const startFiles = defaultFiles.map((url) => ({
        url,
        key: url,
        name: url,
        size: 0,
        serverData: null,
      }))
      setFiles(startFiles)
    }
  }, [])

  // single file upload
  if (files.length === 1) {
    const fileType = files[0].name.split(".")[1]

    if (fileType !== "pdf") {
      return (
        <div className="w-full flex justify-center">
          <div className="relative h-28 w-28">
            <Image
              fill
              alt="Server upload image"
              src={files[0].url}
              className="rounded-full"
              sizes="auto"
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

    if (fileType === "pdf") {
      return (
        <div className="w-full flex justify-center">
          <div className="relative">
            <div className="flex items-center w-full">
              <File className="w-24 h-24 text-indigo-500" />
              <a
                href={files[0].url}
                target="_blank"
                className="text-sm text-indigo-500 hover:underline"
              >
                {files[0].url}
              </a>
            </div>
            <button
              title="Remove image"
              onClick={clearFilesHandler}
              className="absolute  text-white bg-red-500 z-100000 right-[-10px] top-[-10px] rounded-full shadow-sm hover:bg-red-600"
            >
              <X />
            </button>
          </div>
        </div>
      )
    }
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
