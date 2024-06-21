import { ChatHeader } from "@/components/Chat/chat-header"
import { ChatInput } from "@/components/Chat/chat-input"
import { ChatMessages } from "@/components/Chat/chat-messages"
import { currentProfile } from "@/lib/curren-profile"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

interface ChannelsPageProps{
  params: {
    serverId: string,
    channelId: string,
  }
}

const ChannelsPage = async ({params}: ChannelsPageProps) => {
  const profile = await currentProfile()
  if(!profile){
    return auth().redirectToSignIn()
  }
  const channel = await db.channel.findUnique({
    where: {
      id: params?.channelId,
    }
  })

  const member = await db.member.findFirst({
    where: {
      serverId: params?.serverId,
      profileId: profile.id
    }
  })

  if(!channel || !member){
    return redirect(`/`)
  }

  return(
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader 
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      <ChatMessages 
        name={channel.name}
        member={member}
        chatId={channel.id}
        type="channel"
        apiUrl="/api/messages"
        socketUrl="/api/socket/messages"
        socketQuery={{
          channelId: channel.id,
          serverId: channel.serverId
        }}
        paramKey="channelId"
        paramValue={channel.id}

      />
        <ChatInput
          name={channel.name}
          type="channel"
          apiUrl="/api/socket/messages"
          query={{
            channelId: channel.id,
            serverId: channel.serverId
          }}
        />
      
    </div>
  )
}
export default ChannelsPage
