import { ChatHeader } from "@/components/Chat/chat-header"
import { ChatInput } from "@/components/Chat/chat-input"
import { ChatMessages } from "@/components/Chat/chat-messages"
import { MediaRoom } from "@/components/media-client"
import { getORcreateConversation } from "@/lib/conversations"
import { currentProfile } from "@/lib/curren-profile"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { ChannelType } from "@prisma/client"
import { redirect } from "next/navigation"

interface MemberConversationPageProps {
  params: {
    memberId: string,
    serverId: string
  },
  searchParams: {
    video?: boolean
  }
}

const MemberConversationPage = async ({params, searchParams}: MemberConversationPageProps) => {
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
      {!searchParams.video && (
        <>
          <ChatMessages type="conversation"
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            apiUrl="/api/direct-messages"
            socketQuery={
            { conversationId: conversation.id }
            }
            socketUrl="/api/socket/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
          />
          <ChatInput 
            type="conversation"
            name={otherMember.profile.name}
            apiUrl="/api/socket/direct-messages"
            query={
              {conversationId: conversation.id
              }
            }
          />
        </>
      )}
        {searchParams.video && (
          <MediaRoom
          chatId={conversation.id}
          video={true}
          audio={true}
          />
        )}
    </div>
  )
}
export default MemberConversationPage