'use client'

import { useEffect, useState } from "react"
import CreateServerModal from "@/components/Modals/create-server-modal"
import InviteModal from "@/components/Modals/invite-modals"
import EditServerModal from "@/components/Modals/edit-server-modal"
import MemberModal from "../Modals/members-modal"
import CreateChannelModal from "../Modals/create-channel-model"
import LeaverServer from "../Modals/Leave-server_modal"
import DeleteServer from "../Modals/Delete-server-modal"

export const ModalProvider = ( ) => {
  const [isMounted, SetIsMounted] = useState(false)
  
  useEffect(() => {
    SetIsMounted(true)
  },[])

  if(!isMounted){
    return null;
  }
  
  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MemberModal />
      <CreateChannelModal />
      <LeaverServer />
      <DeleteServer />
    </>
  )
}