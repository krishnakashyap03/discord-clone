import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "./ui/avatar"

interface UserAvatarProps{
  src?: string,
  className?: string,
  onClick?: () => void;
}


export const UserAvatar = ({onClick ,src, className}: UserAvatarProps) => {
  return (
    <div>
      <Avatar className={cn(
        "h-7 w-7 md:h-10 md:w-10", className
      )}>
        <AvatarImage onClick={onClick} src={src} />
      </Avatar>
    </div>
  )
}