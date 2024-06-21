import { currentProfile } from "@/lib/curren-profile"
import { NextResponse } from "next/server"

export default async function GET(req: Request){
  try {
    const profile = await currentProfile()
    const {searchParams} = new URL(req.url);
    
    const cursor = searchParams.get('cursor')
    const channelId = searchParams.get('channelId')

    if(!profile){
      return new NextResponse("Unauthorized", {status: 400})
    }
    if(!cursor){
      console.log("[Cursor-Missing]")
      return new NextResponse("Cursor Missing", {status: 500})
    }
    if(!channelId){
      return new NextResponse("ChannelId Missing",{status: 400})
    }




  } catch (error) {
    console.log("[Messages_Get-Error]", error)
    return new NextResponse("Internal Error", {status: 500})
  }
}