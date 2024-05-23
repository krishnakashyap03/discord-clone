'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import qs from 'query-string'

import { Button } from "@/components/ui/button"

import axios from 'axios'
import { useModal } from "@/hooks/use-model-store"
import { DialogDescription } from "@radix-ui/react-dialog"
import { ServerWithMembersWithProfiles } from "@/types"
import { ScrollArea } from "../ui/scroll-area"
import { UserAvatar } from "../User-avatar"
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react"
import { useState } from "react"
import { DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { MemberRole } from "@prisma/client"
import { useRouter } from "next/navigation"

const roleIconMap = {
  "GUEST": null,
  "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
}



const MemberModal = () => {
  const router = useRouter()
  const {isOpen, onOpen, onClose, type, data} = useModal();
  const [LoadingId, setLoadingId] = useState("")

  const { server } = data as { server: ServerWithMembersWithProfiles };
  const isModalOpen = isOpen && type === 'Members'

  const OnRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId)

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        }
      })
      const response = await axios.patch(url, { role })
      
      router.refresh();
      onOpen("Members", { server: response.data })
    } catch (error) {
      console.log("[Memberole error]", error) 
    } finally {
      setLoadingId("")
    }
  }
  const OnKick = async (memberId: string) => {
    try {
      setLoadingId(memberId)
      
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id
        }
      })

      const response = await axios.delete(url)
      onOpen("Members", {server: response.data})

    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId("")
    }
  } 

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white  text-black  overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manager Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
          {server?.members?.length} Member
        </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.profile.imageURL} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center ">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">
                  {member.profile.email}
                </p>
              </div>
              {server.profileId !== member.profileId && LoadingId !== member.id && 
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="h-20 ">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestion className="w-4 h-4 mr-2"/>
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => OnRoleChange(member.id, "GUEST")}>
                              <Shield className="h-4 w-4 mr-2"/>
                              Guest
                              {member.role === "GUEST" && (
                                <Check className="h-4 w-4 ml-auto"/>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => OnRoleChange(member.id, "MODERATOR")}>
                              <ShieldCheck className="h-4 w-4 mr-2"/>
                              Moderator
                              {member.role === "MODERATOR" && (
                                <Check className="h-4 w-4 ml-auto"/>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator>
                        <DropdownMenuItem onClick={() => OnKick(member?.id)}>
                          <Gavel className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuSeparator>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              }
              {LoadingId === member.id && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4"/>
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default MemberModal
