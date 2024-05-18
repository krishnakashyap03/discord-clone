'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import  {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon
} from 'next-share'


import { Button } from "@/components/ui/button"

import axios from 'axios'
import { useModal } from "@/hooks/use-model-store"
import { Label } from "@/components/ui/label"
import { Input } from "../ui/input"
import { Check, Copy, RefreshCcw } from "lucide-react"
import { useOrigin } from "@/hooks/use-origin"
import { useState } from "react"
import { set } from "react-hook-form"



const InviteModal = () => {
  const {isOpen, onOpen, onClose, type, data} = useModal()
  const origin = useOrigin();

  const {server} = data;

  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isModalOpen = isOpen && type === 'Invite'
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  const onNew = async () => {
    try {
      setIsLoading(true)

      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)

      onOpen("Invite", {server: response.data})

    } catch (error) {
      console.log(error)
    } finally{
      setIsLoading(false)
    }
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white  text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 flex flex-col">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input 
            disabled={isLoading}

            className="bg-zinc-300/50 border-0 focus-visible::ring-0 text-black focus-visible:ring-offset-0"
            value={inviteUrl}
            />
            <Button 
            disabled={isLoading}
            size="icon"
            onClick={onCopy} >
              {copied? <Check className="w-4 h-4"/> :<Copy className="w-4 h-4"/> }
            </Button>
          </div>
          <div>
            <Button
            onClick={onNew}
            disabled={isLoading}
            variant="link"
            size='sm'
            className="text-xs text-zinc-500 mt-4"
            >
              Generate New Invite Link
              <RefreshCcw className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="flex gap-2 ">
            <FacebookShareButton disabled={isLoading}
            url={inviteUrl} blankTarget>
              <FacebookIcon size={40} round/>
            </FacebookShareButton>
            <TwitterShareButton 
            disabled={isLoading}
            url={inviteUrl} blankTarget>
              <TwitterIcon size={40} round/>
            </TwitterShareButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InviteModal
