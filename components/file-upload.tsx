"use client"
import { File, X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";

interface FileUploadProps{
  onChange: (url? : string) => void;
  value: string;
  endPoint: "messageFile" | "serverImage" 
}

export const FileUpload = ({endPoint, onChange, value }: FileUploadProps) => {

  const fileType = value?.split(".").pop();
  if(value && fileType !== "pdf"){
    return (
      <div className="relative h-20 w-20">
        <Image 
          fill 
          src={value}
          alt="upload"
          className="rounded-full"
        />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
        >
          <X  className="h-4 w-4"/>
        </button>
      </div>
    )
  }
  if(value && fileType === "pdf"){
    return (
      <div className="relative p-2 flex items-center mt-2 rounded-md bg-background/10">
        <File className="h-10 w-10 fill-indigo-200 stroke-indigo-600" />
        <a href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline "
        >{value}</a>
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
        >
          <X  className="h-4 w-4"/>
        </button>
      </div>
    )
  }
  return (
    <UploadDropzone endpoint={endPoint}
    onClientUploadComplete={(res) => {
      onChange(res?.[0].url);
    }}
    onUploadError={(error: Error) => {
      console.log(error);
    }}
    />
  )
}