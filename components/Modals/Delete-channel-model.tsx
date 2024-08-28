'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"


import { Button } from "@/components/ui/button"
import qs from 'query-string'
import axios from 'axios'
import { useModal } from "@/hooks/use-model-store"
import {  ShieldAlert } from "lucide-react"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"



const DeleteChannel = () => {
  const {isOpen, onOpen, onClose, type, data} = useModal()
  const router = useRouter()
  const params = useParams()


  const {channel} = data;
  const [isLoading, setIsLoading] = useState(false)
  

  const isModalOpen = isOpen && type === 'deleteChannel'
  const onClick = async () => {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: params?.serverId,
        },
      })
      await axios.delete(url)

      onClose()
      router.refresh()
      router.push(`/servers/${params?.serverId}`)
      
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
            Delete &quot;{channel?.name}&quot; Channel
          </DialogTitle>
          <DialogDescription className="text-center text-md">
            Are you Sure you want to Delete <span className="font-semibold text-indigo-500">#{channel?.name}</span> Channel
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-grey-100 px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <Button className="bg-white-100"
              disabled={isLoading}
              onClick={() => onClose()}
              variant="ghost"
              >
                Cancel
              </Button>
              <Button className= ""
              disabled={isLoading}
              onClick={onClick}
              variant="primary"
              >
                Delete <ShieldAlert className="h-4 w-4 ml-2" />
              </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteChannel
