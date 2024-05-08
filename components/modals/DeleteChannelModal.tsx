'use client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import qs from "query-string"
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";



export const DeleteChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal()
    const router = useRouter()
    const params = useParams()

    const [isLoading, setIsLoading] = useState(false)

    const isModalOpen = isOpen && type === "deleteChannel"
    const { server, channel } = data


    const onClick = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id

                }
            })

            await axios.delete(url)
            onClose()
            router.refresh()
            router.push(`/servers/${server?.id}`)
        } catch (error) {
            console.log(error);

        } finally {
            setIsLoading(false)
        }
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        删除频道
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        你确定要永久删除 <span className=" font-semibold text-indigo-500">{channel?.name}</span>频道吗?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex item-center justify-between w-full">
                        <Button disabled={isLoading} onClick={onClose} variant="ghost">
                            取消
                        </Button>
                        <Button disabled={isLoading} variant="primary" onClick={onClick}>
                            确定
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}