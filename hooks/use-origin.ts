import { useEffect, useState } from "react";
export const useOrigin = () => {
  const [Mounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  },[])

  const origin = typeof window !== "undefined" && window.location.origin? window.location.origin: ""

  if(!Mounted){
    return null
  }
  return origin
}