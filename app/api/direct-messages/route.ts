import { currentProfile } from "@/lib/curren-profile"
import { db } from "@/lib/db"
import { DirectMessage } from "@prisma/client"
import { NextResponse } from "next/server"

const Messages_Batch = 10

export async function GET(req: Request){
  try {
    const profile = await currentProfile()
    const {searchParams} = new URL(req.url)
    
    const cursor = searchParams.get('cursor')
    const conversationId = searchParams.get('conversationId')

    if(!profile){
      return new NextResponse("Unauthorized", {status: 400})
    }
    if(!conversationId){
      return new NextResponse("conversatonId Missing", {status: 400})
    }

    let messages: DirectMessage[] = []
    if(cursor){
      messages = await db.directMessage.findMany({
        take: Messages_Batch,
        skip: 1,
        cursor:{
          id: cursor,
        },
        where:{
          conversationId,
        },
        include:{
          member:{
            include:{
              profile: true,
            }
          }
        },
        orderBy:{
          createdAt: 'desc'
        }
      })
    } else{
      messages = await db.directMessage.findMany({
        take: Messages_Batch,
        where:{
          conversationId,
        },
        include:{
          member:{
            include:{
              profile: true,
            }
          }
        },
        orderBy:{
          createdAt: "desc"
        }
      })
    }
    let nextCursor = null;
    if(messages.length === Messages_Batch){
      nextCursor = messages[Messages_Batch - 1].id;
    }
    console.log(nextCursor)

    return NextResponse.json({
      items: messages,
      nextCursor,
    })


  } catch (error) {
    console.log('[Messages-Get-error]', error)
    return new NextResponse("Internal Error", {status: 500})
  }
}