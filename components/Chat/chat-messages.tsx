'use client'

import { Member, Message, Profile } from "@prisma/client"
import { ChatWelcome } from "./chat-welcome"
import { useChatQuery } from "@/hooks/use-chat-query"
import { Loader2, ServerCrash } from "lucide-react"
import { Fragment, useRef, ElementRef } from "react"
import {format} from 'date-fns'
import { ChatItem } from "./chat-item"
import { time } from "console"
import { ChatSocket } from "@/hooks/use-chat-socket"
import { ChatScroll } from "@/hooks/use-chat-scroll"

type MessagewithMemberwithProfile = Message & {
  member: Member &{
    profile: Profile
  }
}
const DATE_FORMAT = "d MMM yyyy, HH:mm"



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

  const chatref = useRef<ElementRef<"div">>(null)
  const bottomref = useRef<ElementRef<"div">>(null)

  const queryKey = `chat:${chatId}`
  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:message:update`

  const {data, isFetchingNextPage, fetchNextPage, hasNextPage, status, isLoading} = useChatQuery({
    apiUrl,
    paramKey,
    paramValue,
    queryKey
  });
  
  ChatSocket({queryKey, addKey, updateKey})

  ChatScroll({chatref, bottomref, loadMore: fetchNextPage, 
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
   })
   
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

    <div ref={chatref} className="flex-1 flex flex-col overflow-y-auto py-4">
      {!hasNextPage && <div className="flex-1"/>}
      {!hasNextPage && (<ChatWelcome type={type} name={name} />)}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ?(
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ): <button onClick={() => fetchNextPage} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition ">
            Load Previous Messages
            </button>}
        </div>
      )}

      <div className="flex flex-col-reverse mt-auto">
        {data?.pages.map((group, i) => (
          <Fragment key={i}>
              {group.items.map((message: MessagewithMemberwithProfile ) => (
                <ChatItem 
                  currentMember={member}
                  key={message.id}
                  id={message.id}
                  fileUrl={message.fileUrl}
                  deleted={message.deleted}
                  timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                  isUpdated={message.updatedAt !== message.createdAt}
                  socketQuery={socketQuery}
                  socketUrl={socketUrl}
                  member={message.member}
                  content={message.content}
                />
              ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomref} />
    </div>
  )
}