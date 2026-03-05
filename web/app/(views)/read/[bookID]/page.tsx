import ReadEpub from "@/app/components/ReadEpub";
import {getBooksById} from "@/app/api";

export default async function ReadingPage({params}: { params: Promise<{ bookID: string }> }) {
    const {bookID} = await params;
    const res = await getBooksById({path: {id: bookID}})
    const b = res.data?.data

    if (!b) return <div>Không tìm thấy sách</div>
    if (!b.unzip_root_url) return <div>Sách này chưa hỗ trợ đọc Online, quay lại sau nhé</div>

    return <ReadEpub unzipRootURL={b.unzip_root_url}/>
}
