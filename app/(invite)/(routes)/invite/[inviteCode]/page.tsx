import { currentProfile } from "@/lib/curren-profile"
import { db } from "@/lib/db"
import { auth, redirectToSignIn } from "@clerk/nextjs/server"
import { create } from "domain"
import { redirect } from "next/navigation"

interface InviteCodePageProps{
  params: {inviteCode: string}
}

const InviteCodePage =async ({params}: InviteCodePageProps) => {
  const profile = await currentProfile()

  if(!profile){
    return auth().redirectToSignIn()
  }
  
  if(!params.inviteCode){
    return redirect("/")
  }
  
  const existsInserver = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  })
  if(existsInserver){
    return redirect(`/servers/${existsInserver.inviteCode}`)
  }
  
  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          }
        ]
      }
    }
  });

  if(server){
    return redirect(`/servers/${server.id}`)
  }

  return (
    <div>
      Inviting code
    </div>
  )
}
export default InviteCodePage