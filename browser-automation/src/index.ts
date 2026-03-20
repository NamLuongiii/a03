import {chromium, Page} from "playwright";
import {saveBook} from "./api-save-book";
import {fetchFileAsBlob} from "./fns";

// 3. Hàm xử lý chi tiết từng cuốn sách
async function crawlBookDetail(page: Page, {detailUrl, downloadUrl}: { detailUrl: string, downloadUrl: string }) {
    await page.goto(detailUrl, {waitUntil: 'domcontentloaded'});
    // Lấy tên tác giả từ trang detail
    const authorName = await page.locator('a[href^="https://sachmoi.net/tac-gia"]').first().innerText();
    console.log('Author:', authorName || 'Unknown')

    await page.goto(downloadUrl, {waitUntil: 'domcontentloaded'});
    // Lấy tên sách từ h1.entry-title
    const name = await page.locator('h1.entry-title').innerText();
    console.log('Name:', name)

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
            console.log(`Downloaded file as ${fileName}`);

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

        if (files.find(file => file.type === 'application/epub+zip')) {
            await saveBook({name, cover: coverBlob, files, author_name: authorName}, filenames);
        } else {
            console.warn('No EPUB file found');
            return;
        }
    }
}

// 4. Hàm chính quét danh sách sách
async function getRootPages(url: string) {
    console.log('00000 Bắt đầu xử lý list book: ', url)
    const browser = await chromium.launch({headless: true});
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url, {waitUntil: 'domcontentloaded'});

    const locators = page.locator('a[class="post-thumbnail"]');
    const count = await locators.count();

    const detailUrls: { detailUrl: string, downloadUrl: string }[] = [];
    for (let i = 0; i < count; i++) {
        const detailUrl = await locators.nth(i).getAttribute('href');
        if (detailUrl) {
            const downloadUrl = detailUrl.replace('https://sachmoi.net/', 'https://sachmoi.net/download/');
            detailUrls.push({detailUrl, downloadUrl});
        }
    }

    // Duyệt qua từng trang chi tiết để cào và upload
    for (const dUrl of detailUrls) {
        console.log(`--- Đang xử lý download url: ${dUrl.downloadUrl} ---`);

        try {
            await crawlBookDetail(page, dUrl);
        } catch (error: any) {
            console.error('❌ Lỗi khi crawl url:', dUrl.downloadUrl, error.message);
        }
    }

    await browser.close();
}


async function run(pageStart: number, pageEnd: number) {
    for (let i = pageEnd; i >= pageStart; i--) {
        console.log(`--- 🎃📙🍑 Đang xử lý trang ${i} 🎃📙🍑---`);
        const url = `https://sachmoi.net/trang/${i}#gsc.tab=0`;
        await getRootPages(url);

        console.log('------------------🎃📙🍑-------------------')
    }
}

async function downloadSingleBook(urlDetail: string) {
    const browser = await chromium.launch({headless: true});
    const context = await browser.newContext();
    const page = await context.newPage();
    const downloadUrl = urlDetail.replace('https://sachmoi.net/', 'https://sachmoi.net/download/');
    crawlBookDetail(page, {detailUrl: urlDetail, downloadUrl})
}

run(146, 206)