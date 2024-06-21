import { Channel, ChannelType, Server } from '@prisma/client';
import { create } from 'zustand'

export type Modaltype = "createServer" | "Invite" | 'EditServer'| "Members" | "createChannel" | "LeaveServer" | "DeleteServer" | "deleteChannel" | "editChannel" | "SendFile"
  

interface ModalData{
  server?: Server 
  channelType?: ChannelType
  channel?: Channel
  apiUrl?: string 
  query?: Record<string, any>
}

interface ModalStore{
  type: Modaltype | null;
  isOpen: boolean;
  onClose: () => void;
  onOpen: (type: Modaltype, data?: ModalData) => void;
  data: ModalData
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({type: null, isOpen: false}),
  data: {}
}))
