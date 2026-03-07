import {chromium, Download, Page} from "playwright";
import path from "path";
import fs from "fs";
import https from "https";

export async function downloadFirstImage(page: Page, downloadPath: string) {
    // 1. Tìm img đầu tiên có thuộc tính width="125"
    // Selector: img[width="125"]
    const imgLocator = page.locator('img[width="125"]').first();

    if (await imgLocator.count() > 0) {
        // 2. Lấy link từ thuộc tính 'src'
        const absoluteUrl = await imgLocator.getAttribute('src');

        if (absoluteUrl) {
            // Tạo tên file (ví dụ: cover.jpg)
            const fileName = "cover_" + (path.basename(absoluteUrl).split('?')[0] || 'image.png');
            const filePath = path.join(downloadPath, fileName);

            console.log(`📸 Đang tải ảnh: ${absoluteUrl}`);

            // 3. Tiến hành tải bằng https (vì ảnh thường không kích hoạt sự kiện 'download' của trình duyệt)
            const file = fs.createWriteStream(filePath);
            https.get(absoluteUrl, (response) => {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ Đã lưu ảnh vào: ${filePath}`);
                });
            }).on('error', (err) => {
                fs.unlinkSync(filePath);
                console.error('Lỗi tải ảnh:', err.message);
            });
        }
    } else {
        console.log('❌ Không tìm thấy ảnh có width="125"');
    }
}

export async function downloadFromPage(url: string) {
    const browser = await chromium.launch({headless: true});
    const context = await browser.newContext();
    const page = await context.newPage();
    const prefix = "https://docs.google.com/uc?export=download&";


    // 1. Chỉ định folder lưu file
    const downloadPath = path.join(__dirname, 'downloads');
    if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath, {recursive: true});


    try {
        await page.goto(url, {waitUntil: 'domcontentloaded'});

        // Tim ten sach
        const title = await page.locator('h1.entry-title').innerText();
        console.log('Tiêu đề bài viết:', title);

        await downloadFirstImage(page, downloadPath)

        const locators = page.getByRole('link', {name: 'Download', exact: true});
        const count = await locators.count();
        console.log(`Tìm thấy ${count} nút Download. Đang kiểm tra link...`);

        for (let i = 0; i < count; i++) {
            const locator = locators.nth(i);
            const href = await locator.getAttribute('href');

            if (href && href.startsWith(prefix)) {
                console.log(`🚀 Bắt đầu tải file thứ ${i + 1}...`);

                // MẸO: Khởi tạo promise download NGAY TRƯỚC khi click
                const downloadPromise = page.waitForEvent('download');

                // CLICK để kích hoạt tải xuống
                await locator.click();

                // Chờ và lưu file
                const download: Download = await downloadPromise;
                const fileName = download.suggestedFilename();
                const filePath = path.join(downloadPath, fileName);

                await download.saveAs(filePath);

                console.log(`✅ Thành công: ${fileName}`);
            }
        }
    } catch (error) {
        console.error("Lỗi trong quá trình thu thập:", error);
    } finally {
        await browser.close();
        console.log("--- Hoàn thành ---");
    }
}

downloadFromPage('https://sachmoi.net/download/vu-tru-xoan-tron-bo#gsc.tab=0');