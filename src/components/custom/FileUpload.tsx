/* eslint-disable react-hooks/exhaustive-deps */
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
    const fileUrls = response.map((file) => file.url)
    onChange(fileUrls)
    setFiles(response)
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
        <div className="flex w-full justify-center">
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
              className="z-100000  absolute right-0 top-0 rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
            >
              <X />
            </button>
          </div>
        </div>
      )
    }

    if (fileType === "pdf") {
      return (
        <div className="flex w-full justify-center">
          <div className="relative">
            <div className="flex w-full items-center">
              <File className="h-24 w-24 text-indigo-500" />
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
              className="z-100000  absolute right-[-10px] top-[-10px] rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
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
      className="rounded-sm bg-zinc-300/30"
      onClientUploadComplete={uploadHandler}
      onUploadError={onError}
    />
  )
}
