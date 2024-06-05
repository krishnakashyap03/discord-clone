'use client'

import { useEffect, useState } from "react"
import CreateServerModal from "@/components/Modals/create-server-modal"
import InviteModal from "@/components/Modals/invite-modals"
import EditServerModal from "@/components/Modals/edit-server-modal"
import MemberModal from "@/components/Modals/members-modal"
import CreateChannelModal from "@/components/Modals/create-channel-model"
import LeaverServer from "@/components/Modals/Leave-server_modal"
import DeleteServer from "@/components/Modals/Delete-server-modal"
import DeleteChannel from "@/components/Modals/Delete-channel-model"
import EditChannelModal from "../Modals/edit-channel-modal"

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
      <DeleteChannel />
      <EditChannelModal />
    </>
  )
}