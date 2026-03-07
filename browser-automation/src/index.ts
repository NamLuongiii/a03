import axios from "axios";
import {chromium, Page} from "playwright";

type BookData = {
    name: string;
    cover: any; // Sử dụng Blob hoặc Buffer cho Node.js
    files: any[];
    // readingFile: any
}

// 1. Hàm gửi dữ liệu lên Server
export async function saveBook(data: BookData, filenames: string[]) {
    try {
        const formData = new FormData();
        formData.append('name', data.name);

        // Append cover (dạng Blob/File)
        formData.append('cover', data.cover, 'cover.jpg');

        // Append danh sách files
        data.files.forEach((file, index) => {
            formData.append('files', file, filenames[index]);

            if (filenames[index].endsWith('.epub') && !formData.get('readingFile'))
                formData.append('readingFile', file, filenames[index]);
        });

        const res = await axios.post('http://localhost:8080/api/v1/books', formData);
        console.log('🚀 Save book success:', res.data.message);
    } catch (error: any) {
        console.error(error)
        console.error('❌ Lỗi khi gọi API saveBook:', error.message);
    }
}

// 2. Hàm hỗ trợ tải file về Buffer (để không cần lưu ổ cứng)
async function fetchFileAsBlob(url: string): Promise<Blob> {
    const response = await axios.get(url, {responseType: 'arraybuffer'});
    // Xác định type dựa trên link hoặc mặc định image/jpeg
    const contentType = response.headers['content-type'];
    console.log('Content-Type:', contentType);
    return new Blob([response.data], {type: contentType});
}

// 3. Hàm xử lý chi tiết từng cuốn sách
async function crawlBookDetail(page: Page, url: string) {
    await page.goto(url, {waitUntil: 'domcontentloaded'});

    // Lấy tên sách từ h1.entry-title
    const name = await page.locator('h1.entry-title').innerText();

    // Lấy ảnh cover (img width=125)
    const imgLocator = page.locator('img[width="125"]').first();
    const imgSrc = await imgLocator.getAttribute('src');
    const coverBlob = imgSrc ? await fetchFileAsBlob(new URL(imgSrc, page.url()).href) : null;

    // Lấy danh sách file từ link Google Drive
    const files: Blob[] = [];
    const prefix = "https://docs.google.com/uc?";
    const locators = page.getByRole('link', {name: 'Download', exact: true});
    const count = await locators.count();

    const filenames: string[] = [];

    for (let i = 0; i < count; i++) {
        const locator = locators.nth(i);
        const href = await locator.getAttribute('href');

        if (href && href.startsWith(prefix)) {
            // Đợi sự kiện download và click
            const downloadPromise = page.waitForEvent('download');
            await locator.click();
            const download = await downloadPromise;
            const fileName = download.suggestedFilename();
            console.log(`Downloaded file from href ${href} as ${fileName}`);

            let contentType = '';

            // Cách B: Tự động hơn dựa trên đuôi file
            if (fileName.endsWith('.epub')) contentType = 'application/epub+zip';
            if (fileName.endsWith('.mobi')) contentType = 'application/x-mobipocket-ebook';
            if (fileName.endsWith('.pdf')) contentType = 'application/pdf';
            if (fileName.endsWith('.azw3')) contentType = 'application/vnd.amazon.ebook';

            if (!contentType) {
                console.warn(`Unknown file type for ${fileName}`);
                continue;
            }

            // Thay vì .saveAs(), ta lấy stream và chuyển thành Blob
            const stream = await download.createReadStream();
            if (stream) {
                // Chuyển stream sang Buffer rồi sang Blob
                const chunks = [];
                for await (const chunk of stream) {
                    chunks.push(chunk);
                }
                files.push(new Blob(chunks, {type: contentType}));
                filenames.push(fileName);
            }
        }
    }

    if (coverBlob) {
        if (files.length === 0) {
            console.warn('No files found for this book');
            return;
        }
        await saveBook({name, cover: coverBlob, files}, filenames);
    }
}

// 4. Hàm chính quét danh sách sách
async function getRootPages(url: string) {
    const browser = await chromium.launch({headless: true});
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url, {waitUntil: 'domcontentloaded'});

    const locators = page.locator('a[class="post-thumbnail"]');
    const count = await locators.count();

    const detailUrls: string[] = [];
    for (let i = 0; i < count; i++) {
        const href = await locators.nth(i).getAttribute('href');
        if (href) {
            detailUrls.push(href.replace('https://sachmoi.net/', 'https://sachmoi.net/download/'));
        }
    }

    // Duyệt qua từng trang chi tiết để cào và upload
    for (const dUrl of detailUrls) {
        console.log(`--- Đang xử lý: ${dUrl} ---`);
        await crawlBookDetail(page, dUrl);
    }

    await browser.close();
}

getRootPages('https://sachmoi.net/trang/398#gsc.tab=0');