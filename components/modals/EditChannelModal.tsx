'use client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

import { useForm } from "react-hook-form";

import * as z from "zod"
import qs from "query-string"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import { useEffect } from "react";

const formSchema = z.object({
    name: z.string().min(1, { message: "需要频道名" }).refine(name => name !== "基础", {
        message: "频道类型不能为基础"
    }),
    type: z.nativeEnum(ChannelType)
})

export const EditChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal()

    const isModalOpen = isOpen && type === "editChannel"

    const { channel,server } = data

    const router = useRouter()
    

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type:  channel?.type||ChannelType.TEXT
        }
    })

    useEffect(() => {
        if (channel) {
            form.setValue("name",channel.name)
            form.setValue("type",channel.type)
        }
    }, [channel,form]);

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })

            await axios.patch(url, values)

            form.reset()
            router.refresh()
            onClose()

        } catch (error) {
            console.log(error)
        }
    }

    const handleClose = () => {
        form.reset()
        onClose()
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        编辑频道
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField name="name" control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            频道名
                                        </FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading} className="bg-zinc-300/50 border-0 focus-visible:ring-0
                                        text-black focus-visible:ring-offset-0" placeholder="输入频道名" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <FormField control={form.control} name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>频道类型</FormLabel>
                                        <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black
                                            ring-offset-0 focus:ring-offset-0 outline-none">
                                                    <SelectValue placeholder="选择一个频道类型" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map((type) => (
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                        className=""
                                                    >
                                                        {type === "TEXT" ? "文字" : type === "AUDIO" ? "语音" : "视频"}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>

                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button disabled={isLoading} variant="primary">
                                更改
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}