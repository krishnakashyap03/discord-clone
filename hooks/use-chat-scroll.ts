import { useEffect, useState } from "react";

type ChatScrollProps = {
  chatref: React.RefObject<HTMLDivElement>
  bottomref: React.RefObject<HTMLDivElement>
  shouldLoadMore: boolean,
  loadMore: () => void;
  count: number;
}

export const ChatScroll = ({chatref, bottomref, shouldLoadMore, loadMore, count}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false)
  useEffect(()=>{
    const topDiv = chatref?.current;
    const handleScroll = () =>{
      const scrollTop =  topDiv?.scrollTop

      if(scrollTop === 0 && shouldLoadMore){
        loadMore()
      }
    };
    topDiv?.addEventListener("scroll", handleScroll);

    return () => topDiv?.removeEventListener("scroll", handleScroll)
  },[shouldLoadMore, chatref, loadMore])

  useEffect(() => {
    const bottomDiv = bottomref?.current;
    const topDiv = chatref?.current;

    const shouldAutoScroll = () => {
      if(!hasInitialized && bottomDiv){
        setHasInitialized(true);
        return true
      }
      if(!topDiv){
        return false;
      }
      const distancefromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight

      return distancefromBottom <= 100;
    }
    if(shouldAutoScroll()){
      setTimeout(() => {
        bottomref.current?.scrollIntoView({
          behavior: "smooth"
        });
      }, 300)
    }
    
  },[chatref, count, hasInitialized , bottomref])
}