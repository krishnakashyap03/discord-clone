import { currentProfile } from "@/lib/curren-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request){

  const profile = await currentProfile();
  const {searchParams} = new URL(req.url)
  const serverId = searchParams.get("serverId")

  const { name, type }: {name: string, type: any} = await req.json()
  try {
    if(!profile){
      return new NextResponse("Unauthorized", {status: 401})
    }
    if(!serverId){
      return new NextResponse("serverId not Found", {status: 400})
    }
    if(name === "general"){
      return new NextResponse("Name cannot be General", {status: 400})
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type
          }
        }
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log("[create Channel Error]", error)
    return new NextResponse("Internal Error", {status: 500})
  }
}
