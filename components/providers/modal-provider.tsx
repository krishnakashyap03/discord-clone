'use client'

import { useEffect, useState } from "react"
import CreateServerModal from "../Modals/create-server-modal"
import InviteModal from "../Modals/invite-modals"

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
    </>
  )
}