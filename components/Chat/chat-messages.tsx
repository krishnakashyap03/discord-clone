'use client'

import { Member } from "@prisma/client"
import { ChatWelcome } from "./chat-welcome"
import { useChatQuery } from "@/hooks/use-chat-query"
import { Loader2, ServerCrash } from "lucide-react"

interface ChatMessagesProps{
  name: string,
  member: Member,
  chatId: string,
  apiUrl: string
  socketUrl: string,
  socketQuery: Record<string, string>
  paramKey: "channelId" | "conversationId"
  paramValue: string
  type: "channel" | "conversation"
}

export const ChatMessages = ({
  name, member, paramValue, paramKey, apiUrl, socketUrl, socketQuery, type, chatId
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`
  const {data, isFetchingNextPage, fetchNextPage, hasNextPage, status, isLoading} = useChatQuery({
    apiUrl,
    paramKey,
    paramValue,
    queryKey
  });
  if(isLoading){
    return (
      <div className="flex justify-center items-center flex-1 flex-col">
        <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4"/>
        <p className="text-xs text-zinc-500 dark:text-zinc-300">
          Loading Messages...
        </p>

      </div>
    )
  }
  if(status === "error"){
    return (
      <div className="flex justify-center items-center flex-1 flex-col">
        <ServerCrash className="w-7 h-7 text-zinc-500  my-4"/>
        <p className="text-xs text-zinc-500 dark:text-zinc-300">
          Something Went Wrong!
        </p>
      </div>
    )
  }
  
  return (
    <div className="flex-1 flex flex-col overflow-y-auto py-4">
      <div className="flex-1"/>
      <ChatWelcome type={type} name={name} />
    </div>
  )
}