"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import { useTheme } from "next-themes";



interface IEmojiPicker {
    onChange: (value: string) => void;
}

export const EmojiPicker = ({ onChange }: IEmojiPicker) => {

    const { resolvedTheme } = useTheme()

    return (
        <Popover>
            <PopoverTrigger>
                <Smile className="text-zinc-500 dark:text-zinc-400 hober:text-zinc-600
                dark:hover:text-zinc-300 transition"/>
            </PopoverTrigger>
            <PopoverContent className="bg-transparent border-none shadow-non
            drop-shadow-none mb-16" side="right" sideOffset={40}>

                <Picker theme={resolvedTheme} data={data} locale="zh" onEmojiSelect={(emoji: any) => onChange(emoji.native)} />

            </PopoverContent>
        </Popover>
    )
}