"use client"

import { Member, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "./ChatWelcome";
import { useChatQuery } from "@/hooks/useChatQuery";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment, useRef, ElementRef } from "react";
import { ChatItem } from "./ChatItem";

import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { useChatSocket } from "@/hooks/useChatSocket";
import { useChatScroll } from "@/hooks/useChatScroll";

interface IChatMessages {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
}

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

const DATE_FORMAT = "yyyy年MM月d日, HH:mm"

export const ChatMessages = ({ name, member, chatId, apiUrl,
    socketUrl, socketQuery,
    paramKey, paramValue, type }: IChatMessages) => {
    const queryKey = `chat:${chatId}`
    const addKey = `chat:${chatId}:messages`
    const updateKey = `chat:${chatId}:messages:update`

    const chatRef = useRef<ElementRef<"div">>(null)
    const bottomRef = useRef<ElementRef<"div">>(null)
    const {
        data,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        status
    } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue
    })
    useChatSocket({ addKey, updateKey, queryKey })
    useChatScroll({
        chatRef, bottomRef, loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count: data?.pages?.[0]?.items?.length ?? 0
    })

    if (status === "pending") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    正在加载...
                </p>
            </div>
        )
    }

    if (status === "error") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    出错了！
                </p>
            </div>
        )
    }


    return (
        <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
            {!hasNextPage && <div className="flex-1" />}
            {!hasNextPage && (<ChatWelcome type={type} name={name} />)}
            {hasNextPage && (
                <div className="flex justify-center">
                    {isFetchingNextPage ? (
                        <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
                    ) : (<button onClick={() => fetchNextPage()} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400
                    text-xs my-4 dark:hover:text-zinc-300 transition">
                        加载之前的消息
                    </button>)}
                </div>
            )}
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map((message: MessageWithMemberWithProfile) => (
                            <ChatItem key={message.id} id={message.id}
                                currentMember={member} member={message.member} content={message.content} fileUrl={message.fileUrl}
                                deleted={message.deleted} timestamp={format(new Date(message.createdAt), DATE_FORMAT, { locale: zhCN })
                                } isUpdated={message.updatedAt !== message.createdAt} socketUrl={socketUrl}
                                socketQuery={socketQuery} />
                        ))}
                    </Fragment>
                ))}
            </div>
            <div ref={bottomRef} />
        </div>
    )
}