'use client'
import zod from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Member, MemberRole, Profile } from "@prisma/client"
import { UserAvatar } from "../User-avatar"
import { TooltipAction } from "../action.tooltip"
import { Delete, Edit, Edit2, FileIcon, ShieldAlert, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useRouter, useParams } from 'next/navigation'
import {
  Form,
  FormField,
  FormControl,
  FormItem,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '../ui/input'
import queryString from 'query-string'
import axios from 'axios'

interface ChatItemsProp{
  id: string,
  content: string,
  member: Member & {
    profile: Profile
  },
  timestamp: string,
  fileUrl: string | null,
  deleted: boolean,
  currentMember: Member
  isUpdated: boolean
  socketUrl: string,
  socketQuery: Record<string, string>
} 

const roleIconMap = {
  "GUEST": null,
  "MODERATOR": <ShieldCheck className="h-4 w-4 ml-1 text-indigo-500" />,
  "ADMIN": <ShieldAlert className="h-4 w-4 ml-1 text-rose-500" />
}
const contentSchema = zod.object({
  content: zod.string().min(1)
}) 


export const ChatItem = ({id, content, member, timestamp, fileUrl, deleted, currentMember, isUpdated, socketUrl,socketQuery}: ChatItemsProp) => {
  const fileType = fileUrl?.split(".").pop()
  const [isEditing, setisEditing] = useState(false)
  const [isDeleting, setisDeleting] = useState(false)

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner)
  const EditMessage = !deleted && isOwner && !fileUrl
  const isPdf = fileType === 'pdf' && fileUrl;
  const isImage = !isPdf && fileUrl

  const form = useForm<zod.infer<typeof contentSchema>>({
    resolver: zodResolver(contentSchema),
    defaultValues:{
      content: ""
    }
  })

  const params = useParams();
  const router = useRouter();

  const onMemberClick = () => {
    if(member.id === currentMember.id){
      return;
    } else {
      router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
    }
  } 

   useEffect(() => {
    const handleKeyDown = (event: any) => {
      if(event.key === 'Escape' || event.keyCode === 27){
        setisEditing(false) 
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
   },[])

   const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: zod.infer<typeof contentSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery
      })
      await axios.patch(url, values);

      form.reset();
      setisEditing(false)
    } catch (error) {
      console.log(error)
    }
  }
  const onDelete = async () => {
    try {
      setisDeleting(true)
      const url = queryString.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery
      })  
      await axios.delete(url);

      form.reset();
    } catch (error) {
      console.log(error)
    } finally {
      setisDeleting(false)
    }
  }
  

  useEffect(() => {
    form.reset({
      content: content,
    })
  },[content])
  
  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar onClick={onMemberClick} src={member.profile.imageURL} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer ">
                {member.profile.name}
              </p>
              <TooltipAction label={member.role}>
                {roleIconMap[member.role]}
              </TooltipAction>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{timestamp}</span>
          </div>
          {isImage && (
            <a href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-40 w-40"
            > 
              <Image src={fileUrl}  alt={content} fill className="object-cover"/>
            </a>
          )}
          {isPdf && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 text-indigo-400 stroke-indigo-500 " />
              <a href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF file
              </a>
            </div>
          )}
          {!isEditing && !fileUrl && (
            <p className={cn("text-sm text-zinc-600 dark:text-zinc-300", deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1")}>
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}
                className='flex items-center w-full gap-x-2 pt-2'
                >
                <FormField 
                  control={form.control}
                  name="content"
                  render = {({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input disabled={isLoading} className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200" placeholder="Edited Message"  {...field}/>
                        </div>
                      </FormControl>
                    </FormItem>
                    )}
                />
                <Button disabled={isLoading} variant="primary"size="sm">
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Pres ESC to Cancel and Enter to Save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {EditMessage && (
            <TooltipAction label="Edit" >
                <Edit onClick={() => setisEditing(true)} className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover-text-zinc-300 transition"/>
            </TooltipAction>
          )}
          {!isDeleting && (
            <TooltipAction label="Delete">
              <Delete onClick={onDelete} className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
            </TooltipAction> 
          )}
        </div>
      )}
    </div>
  )
}