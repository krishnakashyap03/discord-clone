import { ChatHeader } from "@/components/Chat/chat-header"
import { getORcreateConversation } from "@/lib/conversations"
import { currentProfile } from "@/lib/curren-profile"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

interface MemberConversationPageProps {
  params: {
    memberId: string,
    serverId: string
  }
}

const MemberConversationPage = async ({params}: MemberConversationPageProps) => {
  const profile = await currentProfile()
  if(!profile){
    return auth().redirectToSignIn()
  }
  const currentMember = await db.member.findFirst({
    where:{
      serverId: params.serverId,
      profileId: profile.id
    },
    include:{
      profile: true
    }
  })
  if(!currentMember){
    return redirect("/")
  }

  const conversation = await getORcreateConversation(currentMember.id, params?.memberId)
  if(!conversation){
    return redirect(`/servers/${params?.serverId}`)
  }
  const {memberOne, memberTwo} = conversation
  
  const otherMember = memberOne.profileId === profile.id ? memberTwo: memberOne

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader 
        serverId={params.serverId}
        type="conversation"
        imageUrl={otherMember.profile.imageURL}
        name={otherMember.profile.name}
      />
      
    </div>
  )
}
export default MemberConversationPage