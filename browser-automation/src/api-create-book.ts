import axios from "axios";

type BookData = {
    name: string;
    cover: File;
    files: File[];
}

export async function saveBook(data: BookData) {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('cover', data.cover);

    for (const file of data.files) {
        formData.append('files', file);
    }

    const res = await axios.post('http://localhost:3000/books', formData)
    console.log('Save book success')
    console.log(res.data.message);
}