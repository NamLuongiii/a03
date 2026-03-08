// 2. Hàm hỗ trợ tải file về Buffer (để không cần lưu ổ cứng)
import axios from "axios";

export async function fetchFileAsBlob(url: string): Promise<Blob> {
    const response = await axios.get(url, {responseType: 'arraybuffer'});
    // Xác định type dựa trên link hoặc mặc định image/jpeg
    const contentType = response.headers['content-type'];
    console.log('Content-Type:', contentType);
    return new Blob([response.data], {type: contentType});
}