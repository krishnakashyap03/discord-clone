'use client'
import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client"
import { TooltipAction } from "../action.tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-model-store";


interface ServerSectionProps{
  label: string,
  role?: MemberRole;
  sectiontype: "channels" | "members";
  channelType?: ChannelType,
  server?: ServerWithMembersWithProfiles 
}



export const ServerSection = ({
  label,
  role,
  sectiontype,
  channelType,
  server
}: ServerSectionProps) => {
  const {onOpen} = useModal()
  
  return (
    
    <div className="flex item-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectiontype === "channels" &&(
        <TooltipAction label="Create Channel" side="top">
            <button onClick={() => onOpen("createChannel", { channelType })} 
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 trasnition ">
              <Plus className="h-4 w-4" />
            </button>
        </TooltipAction>
      )}
      {role === MemberRole.ADMIN && sectiontype === 'members' && (
         <TooltipAction label="Manage Members" side="top">
         <button onClick={() => onOpen("Members", {server})} 
         className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 trasnition ">
           <Settings className="h-4 w-4" />
         </button>
     </TooltipAction>
      )}
    </div>
    
  )
}