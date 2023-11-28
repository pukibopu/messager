import Image from 'next/image'
import {Button} from "@/components/ui/button";

export default function Home() {
    return (
        <div>
            <div className="text-3xl font-bold text-indigo-500">Home</div>
            <Button>
                Click me
            </Button>
        </div>

    )
}
