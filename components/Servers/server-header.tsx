'use client'

import { ServerWithMembersWithProfiles } from "@/types"
import { MemberRole} from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, User, UserPlus } from "lucide-react";
import { useModal } from "@/hooks/use-model-store";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role: MemberRole | undefined;
}

export const ServerHeader = ({server, role}: ServerHeaderProps) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR
  
  return (
    <DropdownMenu >
      <DropdownMenuTrigger
        className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:bg-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
        {server.name}
        <ChevronDown  className="h-5 w-5 ml-auto"/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-md text-black dark:text-neutral-400 space-y-1">

        {isModerator && (
          <DropdownMenuItem 
            onClick={() => onOpen('Invite', {server})}
          className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
          >
            Invite People
            <UserPlus className="h-2 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("EditServer",{server})}
          >
            Server Settings
            <Settings className="h-2 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer"
          onClick={() => onOpen("Members", {server})}
          >
            Manage Members
            <User className="h-2 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer"
          onClick = {() => onOpen("createChannel")}>
            Create Channels
            <PlusCircle className="h-2 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && 
          <DropdownMenuSeparator />
        }
        {isAdmin && (
          <DropdownMenuItem className=" text-rose-500 px-3 py-2 text-sm cursor-pointer"
          onClick={() => onOpen("DeleteServer", {server})}
          >
            Delete server
            <Trash className="h-2 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className=" text-rose-500 px-3 py-2 text-sm cursor-pointer" onClick={() => onOpen("LeaveServer", { server })}
          >
            Leave Server
            <LogOut className="h-2 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
