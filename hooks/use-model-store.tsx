import { Server } from '@prisma/client';
import { create } from 'zustand'

export type Modaltype = "createServer" | "Invite";

interface ModalData{
  server?: Server 
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
