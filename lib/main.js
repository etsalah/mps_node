import * as dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import PCR from 'puppeteer-chromium-resolver';

dotenv.config();


(async () => {
    const option = {
        revision: "",
        detectionPath: "",
        folderName: ".chromium-browser-snapshots",
        defaultHosts: [
            "https://storage.googleapis.com",
            "https://npm.taobao.org/mirrors"
        ],
        hosts: [],
        cacheRevisions: 2,
        retry: 3,
        silent: false
    };
    const stats = await PCR(option);
    const browser = await stats.puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
        executablePath: stats.executablePath
    }).catch(function(error) {
        console.log(error);
    });
  const page = await browser.newPage();
  
  const memberParliament = await crawlMembersPages(page);
  console.log(memberParliament);
  await page.waitForTimeout(4000);
  await browser.close();
})();

async function crawlMembersPages(page) {
  const url = process.env['base_url'] + process.env['members_url_seg'];

  await page.goto(url);

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  const pageUrls = await getPages(page);
  let mpCards = await page.$$('.mpcard'),
    mpDetails = {0: await getMembers(mpCards)};

  for (let i = 1; i < pageUrls.length; i++) {
    await page.goto(pageUrls[i]);
    mpCards =  await page.$$('.mpcard');
    mpDetails[i] = await getMembers(mpCards);
  }
  return mpDetails;
}

async function getPages(pageDocument) {
  const memberPages = await pageDocument.$$('.square'),
    pageAnchors = memberPages.map((node) => node.evaluate(node => node.href));
  let pageUrls = [];

  for (let pageIndex in pageAnchors) {
    let t = await pageAnchors[pageIndex];
    pageUrls.push(t);
  }
  return pageUrls;
}

async function getMembers(mpCards) {
  let mpDetails = [];
  for(let cardIndex in mpCards) {
    let anchor = await mpCards[cardIndex].$('a');
    let anchorElem = await anchor.asElement();
    let href = await anchorElem.getProperty('href');
    let hrefValue = await href.jsonValue();
    // console.log(`a => ${hrefValue}`);
    let img = await anchor.$('img');
    let imgElem = await img.asElement();
    let imgSrc = await imgElem.getProperty('src');
    let imgSrcValue = await imgSrc.jsonValue();
    let imgParts = imgSrcValue.split('/');
    let member_id = imgParts[imgParts.length - 1].replace('.jpg', '');
    // console.log(`image src => ${await imgSrcValue()}`);
    let center = await anchor.$('center');
    let bTags = await center.$$('b');
    let span = await center.$('span');
    let name = await bTags[0].evaluate(node => node.innerText);
    let constituency = await bTags[1].evaluate(node => node.innerText);
    let region = await span.evaluate(node => node.innerText);
    let partyTag = await center.$('p');
    let partyValue = await partyTag.evaluate(node => node.innerText);
    // let text = await center.$eval('b', el => el.textContent);
    // console.log(text);
    let details = {};
    details['member_id'] = member_id;
    details['name'] = name;
    details['constituency'] = constituency;
    details['region'] = region;
    details['image'] = imgSrcValue;
    details['profile_url'] = (
        process.env['base_url'] + process.env['member_profile_seg'] + member_id
    );
    details['party'] =  partyValue;
    mpDetails.push(details);
  }
  return mpDetails;
}