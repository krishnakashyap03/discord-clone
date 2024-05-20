import { currentProfile } from "@/lib/curren-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, {params}: {
  params: {serverId: string}
}){
  const profile = await currentProfile();
  const {name, imageUrl} = await req.json();

  try {
    if(!profile){
      return new NextResponse("Unauthorized", {status: 402})
    }
    if(!params.serverId){
      return new NextResponse("editServerid Missing", {status: 401})
    }
    const server = await db.server.update({
      where:{
        id: params.serverId
      },
      data:{
        name: name,
        imageURL: imageUrl
      }
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log("[Edit-server]", error)
    return new NextResponse("Internal Error", {status: 502})
  }

}