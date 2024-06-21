'use client'

import {
  PopoverTrigger,
  PopoverContent,
  Popover
} from '@/components/ui/popover'
import  Picker  from '@emoji-mart/react'
import  data  from '@emoji-mart/data'
import {useTheme} from 'next-themes'
import { Smile } from 'lucide-react'

interface EmojiPickkerProps {
  onChange: (value: string) => void
}

export const EmojiPickker = ({onChange}: EmojiPickkerProps) => {

  const { resolvedTheme } = useTheme()
  return (
    <>
      <Popover>
          <PopoverTrigger>
            <Smile className='h-5 w-5 text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300 hover:text-zinc-600 transition pointer' />
          </PopoverTrigger>
          <PopoverContent side='right' sideOffset={40} className="bg-transparent border-none shadow-sm drop-shadow-none mb-16">
            <Picker theme={resolvedTheme}  data={data} onEmojiSelect = {(emoji: any) => onChange(emoji.native)} />
          </PopoverContent>
      </Popover>
    </>
  )    
}