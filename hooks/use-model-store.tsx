import { create } from 'zustand'

export type Modaltype = "createServer";

interface ModalStore{
  type: Modaltype | null;
  isOpen: boolean;
  onClose: () => void;
  onOpen: (type: Modaltype) => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) => set({ isOpen: true, type }),
  onClose: () => set({type: null, isOpen: false})
}))
