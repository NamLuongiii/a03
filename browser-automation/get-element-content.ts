import {chromium} from 'playwright';

async function getElementContent() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const url = "https://dtv-ebook.com.vn/me-cung-hoa-hong_26096.html#gsc.tab=0"
  const className = "tab-title"
  
    await page.goto(url);

    // find elements by class tab-title

    // find element second


    // click element second

    //



     await browser.close();
}

getElementContent().catch(console.error);
