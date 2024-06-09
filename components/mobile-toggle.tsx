import {Sheet, SheetContent, SheetTrigger, } from "@/components/ui/sheet"
import { Button } from "./ui/button"
import { Menu } from "lucide-react"
import NavigationSidebar from "./Navigation/Navigation -sidebar"
import { ServerSidebar } from "./Servers/server-sidebar"

const MobileToggle = ({serverId}: {serverId: string}) => {
  return (
    <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden" size='icon'>
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 flex gap-0">
          <div className="w-[72px]">
            <NavigationSidebar />
          </div>
          <ServerSidebar serverId={serverId}/>
        </SheetContent>
      </Sheet>
  )
}

export default MobileToggle