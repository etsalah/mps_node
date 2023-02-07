import * as dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import PCR from 'puppeteer-chromium-resolver';
import Member from '../models/member.js';
import crawlMembersPages from './scrap_members.js';

dotenv.config();


async function getBrowserAndPageObject() {
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
  return {'browser': browser, 'page': page};
}


(async () => {
  const {browser, page} = await getBrowserAndPageObject();
  const memberParliament = await crawlMembersPages(page);
  console.log(memberParliament);
  await page.waitForTimeout(4000);
  await browser.close();
})();

