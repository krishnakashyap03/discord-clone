"use client"

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client"
import { Edit, Hash, Lock, Mic, TrashIcon, Video } from "lucide-react";
import { redirect, useParams, useRouter } from "next/navigation";
import { TooltipAction } from "../action.tooltip";
import { Modaltype, useModal } from "@/hooks/use-model-store";
import { Skeleton } from "../ui/skeleton";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const IconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video
}


export const ServerChannel = ({
  channel, server, role
}: ServerChannelProps) => {
  const router = useRouter()

  const params = useParams()

 const onClick = () =>{
  router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
 }

 const OnAction = (e: React.MouseEvent, action: Modaltype) =>{
  e.stopPropagation();
  onOpen(action, {channel, server})
 }


  const {onOpen} = useModal()
  const Icon = IconMap[channel.type]
  return (
      <div>
        <button onClick={onClick} 
          className={cn("group py-2 rounded flex item-center gap=x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-3", params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700")}
          >
          <Icon  className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-1"/>

          <p className={cn("line-clamp-1 font-semibold text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 text-sm group-hover:text-zinc-500 dark:group-hover:text-zinc-300 transition", 
            params?.channelId === channel.id && "text-primary darl:text-zinc-200 dark:group-hover:text-white"
          )}>
            {channel.name}
          </p>
          {channel.name !== "general" && role !==MemberRole.GUEST && (
            <div className="ml-auto flex items-center gap-x-2">
              <TooltipAction label="Edit">
                <Edit onClick={(e) => OnAction(e, "editChannel",)} className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
              </TooltipAction>
              <TooltipAction label="Delete">
                <TrashIcon onClick={(e) => OnAction(e,"deleteChannel")} className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
              </TooltipAction>
            </div>
          )}
          {channel.name === "general" && (
            <Lock className="ml-auto text-zinc-500 dark:text-zinc-400 h-4 w-4"/>
          )} 
        </button>
      </div>
  )
}