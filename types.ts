import {Server, Profile, Member} from '@prisma/client'

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & {profle: Profile})[];
}