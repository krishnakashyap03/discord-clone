import { currentProfile } from "@/lib/curren-profile"
import { db } from "@/lib/db"
import { ChannelType, MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, 
  {params}: {params: {channelId: string}}
){
  const profile = await currentProfile()
  const { searchParams } = new URL(req.url)
  const serverId = searchParams.get("serverId")
  
  try {
    if(!profile){
      return new NextResponse("Unauthorized", {status: 401})
    }
    if(!serverId){
      return new NextResponse("ServerId-Missing", {status: 400})
    }
    if(!params?.channelId){
      return new NextResponse("ChannelId-Missing", {status: 405})
    }

    const server = await db.server.update({
        where: {
          id: serverId,
          members: {
            some: {
              profileId: profile?.id,
              role: {
                in: [MemberRole.ADMIN, MemberRole.MODERATOR]
              }
            }
          }
        },
      data: {
        channels: {
          delete: {
            id: params?.channelId,
            name: {
              not: "general"
            }
          }
        }
      }
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log("Delete-channel-error", error)
    return new NextResponse("Internal error", {status: 500})
  }
}

export async function PATCH(req: Request, {params}: {params: {channelId: string}}){
  const profile = await currentProfile()
  const {name, type}: {name: string, type: ChannelType} = await req.json()
  const {searchParams} = new URL(req.url)
  const serverId = searchParams.get("serverId")

  try {
    if(!profile){
      return new NextResponse("Unauthorized", {status: 401})
    }
    if(!params?.channelId){
      return new NextResponse("[ChannelId-id-missing]", {status: 400})
    }
    if(!serverId){
      return new NextResponse("[ServerId-Missing]", {status: 404})
    }
    if(name === "general"){
      return new NextResponse("[Name-Can't be General]",{ status : 400})
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members:{
          some:{
            profileId: profile?.id,
            role:{
              in:[MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        } 
      },
      data:{
        channels: {
          update:{
            where:{
              id: params?.channelId,
              NOT: {
                name: "general"
              },
            },
            data:{
              name,
              type
            }
          }
        }
      }
    })

    return NextResponse.json(server)

  } catch (error) {
    console.log("[Edit-channel-Error]", error)
    return new NextResponse("Internal Error", {status: 500})
  }
}