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
} from "@/components/ui/form"
import { Button } from "../ui/button"
import qs from 'query-string'

import {z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { FileUpload } from "@/components/file-upload"
import axios from 'axios'
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-model-store"

const formSchema = z.object({
  fileUrl: z.string()
})


const MessageSendFileModal = () => {
  const {data, onClose, isOpen, type} = useModal()
  let [isMounted, setIsMounted] = useState(false)

  const isModalOpen = isOpen && type === "SendFile"

  const {apiUrl, query} = data
  const router = useRouter()
  useEffect(()=> setIsMounted(true),[])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: ""
    }
  })

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      })
      await axios.post(url, {
        ...values,
        content: values.fileUrl
      })

      form.reset();
      router.refresh();
      onClose()
      
    } catch (error) {
      console.log(error)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose();
  }

  if(!isMounted){
    return null;
  }
  
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white  text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an Attachment
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6 ">
              <div className="flex items-center justify-center text-center">
                <FormField 
                control={form.control}
                name="fileUrl"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload 
                      endPoint = "messageFile"
                      value={field.value}
                      onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant='primary' disabled={isLoading}>
                send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default MessageSendFileModal
