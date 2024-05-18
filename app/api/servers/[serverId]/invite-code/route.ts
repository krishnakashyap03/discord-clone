import { currentProfile } from "@/lib/curren-profile"
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server"
import {v4 as uuidv4} from 'uuid'

export async function PATCH(req: Request,
  {params}: {params: {serverId: string}}
){
  try {
    const profile = await currentProfile();

    if(!profile){
      return new NextResponse("Unauthorized", {status: 402})
    }
    if(!params.serverId){
      return new NextResponse('Server Id Missing', {status: 400})
    }

    const server = await db.server.update({
      where: {id: params.serverId,
        profileId: profile.id
      },
      data: {
        inviteCode: uuidv4()
      }
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log("[Server-id]", error)
    return new NextResponse('Internal Error',{status: 500})
  }
}