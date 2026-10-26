const {chromium} = require('playwright');
const fs = require('fs');
(async()=>{
    const browser = await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
    const page = await browser.newPage({viewport:{width:1440,height:1000}});
    fs.mkdirSync('tests/screenshots/references',{recursive:true});
    for(const [name,url] of [['farm','https://teknritsolutions-2.github.io/Local-Farm-or-Community-Supported-Agriculture-CSA-/pages/public/index.html'],['events','https://teknrit-maker.github.io/High-End-Event-Planning/pages/index.html'],['bookstore','https://teknrit-maker.github.io/Local-Indie-Bookstore/pages/index.html']]) {
        try {
            await page.goto(url,{waitUntil:'networkidle',timeout:25000});
            await page.screenshot({path:`tests/screenshots/references/${name}.png`,fullPage:true});
            console.log(name, await page.evaluate(()=>({font:getComputedStyle(document.body).fontFamily,sections:[...document.querySelectorAll('section')].slice(0,8).map(x=>({class:x.className,title:x.querySelector('h1,h2')?.innerText,padding:getComputedStyle(x).padding}))})));
        } catch(e) { console.log(name,e.message.slice(0,100)); }
    }
    await browser.close();
})();
