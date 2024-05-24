import { currentProfile } from "@/lib/curren-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  {params}: {params: {serverId: string}}
){

  const profile = await currentProfile();
  try {
    if(!profile){
      return new NextResponse("Unauthorized", {status: 402})
    }

    if(!params.serverId){
      return new NextResponse("DeleteServerid Missing", {status: 401})
    }

    const server = await db.server.delete({
      where:{
        id: params.serverId,
        profileId: profile.id
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log("[Delete-server-Error]", error)
    return new NextResponse("Internal Error", {status: 502})
  }

}