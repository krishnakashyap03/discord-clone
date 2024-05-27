'use client'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import{
  Form,
  FormControl,
  FormItem,
  FormField,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import{ Input } from "@/components/ui/input"
import { Button } from "../ui/button"
import qs from 'query-string'
import {z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form"
import axios from 'axios'
import { useParams, useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-model-store"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { ChannelType } from "@prisma/client"

const formSchema = z.object({
  name: z.string().min(1,{
    message: "Channel Name is required!"
  }).refine(
    name => name !== "general",{
      message: "channel Name cant be 'General' Pick Different"
    }
  ),
  type: z.nativeEnum(ChannelType)
})


const CreateChannelModal = () => {
  const {isOpen, onClose, type } = useModal();
  const router = useRouter()
  const params = useParams()

  const isModalOpen = isOpen && type === "createChannel"

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:"",
      type: ChannelType.TEXT
    }
  })

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    try {

      const url = qs.stringifyUrl({
        url: `/api/channels`,
        query: {
          serverId: params?.serverId
        }
      })
      await axios.post(url, values)

      form.reset();
      router.refresh();

    } catch (error) {
      console.log(error)
    }
  }

  const handleClose = () => {
    form.reset();
    onClose();
  }
  
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white  text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create a Channel to Communicate
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6 ">
              <FormField 
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    Channel Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      disabled={isLoading}
                      className = "bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                      placeholder="Enter Channel Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
              <FormField 
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Channel type
                  </FormLabel>
                  <Select disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring:offset0 outline-none capitalize ">
                        <SelectValue placeholder="select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ChannelType).map((Type) =>(
                        <SelectItem key={Type}
                        value={Type}
                        className="capitalize"
                        >
                          {Type.toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
              />

            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant='primary' disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateChannelModal
