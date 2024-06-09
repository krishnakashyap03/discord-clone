'use client'
import { useSocket } from "@/components/providers/socket-provider"
import { Badge } from "./ui/badge"

export const SocketIndicator = () => {
  const {isConnected} = useSocket()

  if(!isConnected){
    return (
      <Badge variant="outline" className="bg-yellow-400 text-white border-none">
        Falling: Back Every sec
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="bg-emerald-400 text-white border-none">
        Live: Updating Real-Time
      </Badge>
  )
}