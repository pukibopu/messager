"use client";

import { useSocket } from "@/components/providers/SocketProvider";
import { Badge } from "./ui/badge";

export const SocketIndicator = () => {
    const { isConnected } = useSocket()

    if(!isConnected) {
        return(
            <Badge variant="outline" className="bg-yellow-600 text-white border-none">
                错误反馈：每一秒轮询
            </Badge>
        )
    }

    return(
        <Badge variant="outline" className="bg-emerald-600 text-white border-none">
            实时:实时更新
        </Badge>
    )
}