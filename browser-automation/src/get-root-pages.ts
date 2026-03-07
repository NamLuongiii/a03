import {chromium} from "playwright";

async function getRootPages(url: string) {
    const browser = await chromium.launch({headless: true});
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url, {waitUntil: 'domcontentloaded'});

    const locators = await page.locator('a[class="post-thumbnail"]')
    const count = await locators.count();

    for (let i = 0; i < count; i++) {
        const locator = locators.nth(i);
        const href = await locator.getAttribute('href');

        if (!href) continue;
        const downloadUrl = href.replace('https://sachmoi.net/', 'https://sachmoi.net/download/');
        console.log(downloadUrl);
    }

    await browser.close();
}

getRootPages('https://sachmoi.net/#gsc.tab=0');