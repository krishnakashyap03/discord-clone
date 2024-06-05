import { currentProfile } from "@/lib/curren-profile"
import { db } from "@/lib/db"
import { ChannelType, MemberRole } from "@prisma/client"
import { redirect } from "next/navigation"
import { ServerHeader } from "./server-header"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ServerSearch } from "./server-search"
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react"
import { Separator } from "../ui/separator"
import { ServerSection } from "./server-section"
import { ServerChannel } from "./server-channel"
import { ServerMembers } from "./server-members"

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4"/> ,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4"/> ,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4"/> 
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500"/>,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />
}


export const ServerSidebar = async ({serverId}: {serverId: string}) => {
  const profile = await currentProfile()
  
  if(!profile){
    return redirect("/")
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc"
        }
      },
      members: {
        include: {
          profile: true
        },
        orderBy: {
          role: 'asc',
        }
      }
    }
  })
  const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
  const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
  const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)

  const members = server?.members.filter((member) => member.profileId !== profile.id)

  if(!server){
    return redirect("/")
  }
  const role = server?.members.find((member) => member.profileId === profile.id)?.role;

  
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]
    ">
      <ServerHeader 
        server = {server}
        role={role}
      />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch 
          data={[
            {
              label: "Text Channels",
              type: "channel",
              data: textChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type]  
              }))
            },
            {
              label: "Voice Channels",
              type: "channel",
              data: audioChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type]  
              }))
            },
            {
              label: "Video Channels",
              type: "channel",
              data: videoChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type]  
              }))
            },
            {
              label: "Members",
              type: "member",
              data: members?.map((member) => ({
                id: member.id,
                name: member.profile.name,
                icon: roleIconMap[member.role]
              }))
            }
          ]}
          />
        </div>
          <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2 " />
          {!!textChannels?.length && (
            <div className="mb-2">
              <ServerSection
                sectiontype="channels"
                channelType={ChannelType.TEXT}
                role={role}
                label="Text channels"
              />
              {textChannels?.map((channel) => (
                <ServerChannel 
                  key={channel.id}
                  channel={channel}
                  server ={server}
                  role={role}
                />
              ))}
            </div>
          )}
          {!!audioChannels?.length && (
            <div className="mb-2">
              <ServerSection
                sectiontype="channels"
                channelType={ChannelType.AUDIO}
                role={role}
                label="Audio channels"
              />
              {audioChannels?.map((channel) => (
                <ServerChannel 
                  key={channel.id}
                  channel={channel}
                  server ={server}
                  role={role}
                />
              ))}
            </div>
          )}
          {!!videoChannels?.length && (
            <div className="mb-2">
              <ServerSection
                sectiontype="channels"
                channelType={ChannelType.VIDEO}
                role={role}
                label="video channels"
              />
              {videoChannels?.map((channel) => (
                <ServerChannel 
                  key={channel.id}
                  channel={channel}
                  server ={server}
                  role={role}
                />
              ))}
            </div>
          )}
          {!!members?.length && (
            <div className="mb-2">
              <ServerSection
                sectiontype="members"
                role={role}
                server ={server}
                label="Members"
              />
              {members?.map((member) => (
                <ServerMembers 
                  key={member.id}
                  member={member}
                  server={server}
                />
              ))}
            </div>
          )}
      </ScrollArea>
    </div>
  )
}