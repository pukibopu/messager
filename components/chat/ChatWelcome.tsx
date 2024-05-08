import { Text } from "lucide-react";

interface IChatWelcome {
    name: string;
    type: "channel" | "conversation";
}
export const ChatWelcome = ({ name, type }: IChatWelcome) => {
    return (
        <div className="space-y-2 px-2 mb-4">
            {type === "channel" && (
                <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
                    <Text className="h-12 w-12 text-white" />

                </div>
            )}
            <p className="text-xl md:text-3xl font-bold">
                {type === "channel" ? "欢迎来到 #" : ""}{name}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                {type === "channel"
                    ? `这是 #${name} 频道.`
                    : `这是你和 ${name} 聊天的开始`
                }
            </p>
        </div>
    )
}