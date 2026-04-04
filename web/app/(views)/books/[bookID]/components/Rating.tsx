'use client'

import {ModelsBook} from "@/app/api";
import {Button, Input, TextArea} from "@heroui/react";
import {useState} from "react";

type Props = {
    book: ModelsBook
}

export default function Rating({book}: Props) {
    const [show, setShow] = useState(false)

    return <div className='p-4 flex flex-col gap-4 justify-center items-center'>
        <h2>Đánh giá về cuốn sách này</h2>
        <Button type='button' onClick={() => setShow(true)}>Đánh giá</Button>
        <small>{book.rating_count ? `${book.rating_count} đánh giá` : 'Chưa có đánh giá'}</small>
        {book.rating_avg ? <small>{book.rating_avg} / 5</small> : ''}

        {show && <form className='flex flex-col gap-4'>
            <h3>Đánh giá của bạn</h3>
            <Input type="number" placeholder='Điểm số' min={1} max={5}/>
            <TextArea placeholder='Bình luận về cuốn sách'/>
            <div className='flex justify-end gap-2'>
                <Button type='button' variant='outline' onClick={() => setShow(false)}>Huỷ</Button>
                <Button type='submit'>Gửi</Button>
            </div>
        </form>}
    </div>
}