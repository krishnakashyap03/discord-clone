import { currentProfile } from "@/lib/curren-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest){
  try {
   const {name, imageUrl} = await req.json();
   const profile = await currentProfile();
   
   if(!profile){
    return new NextResponse("Profile-Not-Found", {status: 400})
   }
   const server = await db.server.create({
    data: {
      profileId: profile.id,
      name: name,
      imageURL: imageUrl,
      inviteCode: uuidv4(),
      channels: {
        create: [
          { name: "general", profileId: profile.id }
        ]
      },
      members: {
        create: [
          {profileId: profile.id, role: MemberRole.ADMIN }
        ]
      }
    }
   })

   return NextResponse.json(server)
   
  } catch (error) {
    console.log("[Server-Post]", error)
    return new NextResponse("Internal Error", {status: 500})
  }
}