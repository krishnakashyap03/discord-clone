'use client'

import { Video, VideoOff } from "lucide-react"
import { TooltipAction } from "./action.tooltip"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import qs from 'query-string'




export const LivevideoBtn = () => {
  const pathname = usePathname()
  const router = useRouter()

  const searchParams = useSearchParams()
  const isVideo = searchParams?.get('video')

  const onClick = () => {
    const url = qs.stringifyUrl({
      url: pathname || "",
      query:{
        video: isVideo? undefined : true,
      }
    }, {skipNull: true})


    router.push(url)
  }

  const tooltipLabel = isVideo? "End Video Call" : "Start Video Call";
  return (
    <TooltipAction side="bottom" label={tooltipLabel} >
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        {!isVideo? <Video className="h-6 w-6 text-zinc-500 dakr:text-zinc-400" /> : <VideoOff className="h-6 w-6 text-zinc-500 dakr:text-zinc-400"/>}
      </button>
    </TooltipAction>
  )
}