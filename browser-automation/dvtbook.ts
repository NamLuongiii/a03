import {chromium} from 'playwright';

async function dvtbook() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const url = "https://dtv-ebook.com.vn/he-thong-de-ta-di-doan-menh_25936.html#gsc.tab=0"
  const id = "download"
  
    await page.goto(url);

    // find elements by id
  const links = await page.$$(`#${id} a`);

    // find all tag a in elements and save src to array
    const srsArr = []
    for (const link of links) {
      const href = await link.getAttribute('href');
      srsArr.push(href)
    }


    console.log(srsArr)



     await browser.close();
}

dvtbook().catch(console.error);
