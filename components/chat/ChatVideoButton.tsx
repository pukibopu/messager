"use client"
import { Video, VideoOff } from "lucide-react"
import { ActionTooltip } from "../ActionTooltip"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"


export const ChatVideoButton = () => {
    const pathName = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const isVideo = searchParams?.get("video")
    const Icon = isVideo ? VideoOff : Video

    const label = isVideo ? "结束通话" : "开始通话"

    const onClick = () => {
        const url = queryString.stringifyUrl({
            url: pathName || "",
            query: {
                video: isVideo ? undefined : true
            },
        }, { skipNull: true })
        router.push(url)
    }
    return (
        <ActionTooltip side="bottom" label={label}>
            <button onClick={onClick} className="hover:opacity-75 transition mr-4">
                <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
            </button>

        </ActionTooltip>
    )
}