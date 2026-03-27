import {ArrowLeft} from "lucide-react";
import {useRouter} from "@tanstack/react-router";

type Props = {
    title: string;
}

export const TitleAndBack = ({title}: Props) => {
    const router = useRouter();

    return (
        <div className="flex items-center gap-4 ">
            <button type='button' onClick={() => router.history.back()}
                    className='btn btn-square btn-soft btn-secondary'>
                <ArrowLeft/>
            </button>
            <div className='text-lg font-semibold'>{title}</div>
        </div>
    )
}