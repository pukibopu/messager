'use client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {useForm} from "react-hook-form";

import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {FileUpload} from "@/components/file-upload";
import axios from "axios";
import {useRouter} from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1, {message: "需要群组名"}),
    imageUrl: z.string().min(1, {message: "需要服务器头像"})
})

export const InitialModal = () => {

    const [isMounted,setIsMounted]=useState(false)
    const router = useRouter()


    useEffect(()=>{
        setIsMounted(true)
    },[])

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post("/api/servers",values)

            form.reset()
            router.refresh()
            window.location.reload()

        }catch (error) {
            console.log(error)
        }
    }

    if (!isMounted) {
        return null
    }

    return (
        <Dialog open>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        自定义你的群组
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        给你的群组一个个性化的名字和头像，后面还可以更改。
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField control={form.control} render={({field})=>(
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload endpoint="serverImage" value={field.value} onChange={field.onChange}/>
                                        </FormControl>
                                    </FormItem>
                                )} name="imageUrl"/>
                            </div>
                            <FormField name="name" control={form.control}
                                       render={({field}) => (
                                           <FormItem>
                                               <FormLabel
                                                   className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                   群组名
                                               </FormLabel>
                                               <FormControl>
                                                   <Input disabled={isLoading} className="bg-zinc-300/50 border-0 focus-visible:ring-0
                                        text-black focus-visible:ring-offset-0" placeholder="输入服务器名" {...field} />
                                               </FormControl>
                                               <FormMessage/>
                                           </FormItem>
                                       )}/>
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button disabled={isLoading} variant="primary">
                                创建
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}