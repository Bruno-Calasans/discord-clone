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
  onChange: (fileUrls: string[], files: UploadCompleteResponse) => void
}

function FileUpload({ endpoint, onChange }: FileUploadProps) {
  const [files, setFiles] = useState<UploadCompleteResponse>([])

  const uploadHandler = (files: UploadCompleteResponse) => {
    setFiles(files)
    onChange(
      files.map((file) => file.url),
      files
    )
  }

  const clearFilesHandler = () => {
    setFiles([])
    onChange([], [])
  }

  if (files.length > 0) {
    // single file upload
    return files.length === 1 ? (
      <div className="w-full flex justify-center">
        <div className="relative h-28 w-28">
          <Image
            fill
            title={files[0].name}
            alt={files[0].name}
            src={files[0].url}
            className="rounded-full"
          />
          <button
            title="Remove images"
            onClick={clearFilesHandler}
            className="absolute  text-white bg-red-500 z-100000 right-0 top-0 rounded-full shadow-sm hover:bg-red-600"
          >
            <X />
          </button>
        </div>
      </div>
    ) : (
      // todo multiple files upload
      <div className="w-full flex justify-center">
        <div className="relative h-28 w-28">
          <Image
            fill
            title={files[0].name}
            alt={files[0].name}
            src={files[0].url}
            className="rounded-full"
          />
          <button
            title="Remove images"
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
      onUploadError={console.log}
    />
  )
}

export default FileUpload
