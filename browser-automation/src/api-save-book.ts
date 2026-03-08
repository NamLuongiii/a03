import axios from "axios";

type BookData = {
    name: string;
    cover: any; // Sử dụng Blob hoặc Buffer cho Node.js
    files: any[];
    author_name?: string;
    // readingFile: any
}

// 1. Hàm gửi dữ liệu lên Server
export async function saveBook(data: BookData, filenames: string[]) {
    // @ts-ignore
    // @ts-ignore
    try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('author_name', data.author_name || '');
        // Append cover (dạng Blob/File)
        formData.append('cover', data.cover, `${data.name}.jpg`);

        // Append danh sách files
        data.files.forEach((file, index) => {
            formData.append('files', file, filenames[index]);

            if (filenames[index].endsWith('.epub') && !formData.get('readingFile'))
                formData.append('readingFile', file, filenames[index]);
        });

        const res = await axios.post('http://localhost:8080/api/v1/books/create-tool', formData);
        console.log('🚀 Save book success:', res.data.message);
    } catch (error: any) {
        console.error(error.response?.data?.message || error.message)
        console.error('❌ Lỗi khi gọi API saveBook:', error.message);
    }
}