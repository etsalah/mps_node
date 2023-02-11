import Member from '../models/member.js';


async function scrapMembersPages(page) {
  const url = process.env['base_url'] + process.env['members_url_seg'];

  await page.goto(url);

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

async function getPages(page) {
  const memberPages = await page.$$('.square'),
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
    let anchor = await mpCards[cardIndex].$('a'),
        anchorElem = await anchor.asElement(),
        href = await anchorElem.getProperty('href'),
        hrefValue = await href.jsonValue(),
        img = await anchor.$('img'),
        imgElem = await img.asElement(),
        imgSrc = await imgElem.getProperty('src'),
        imgSrcValue = await imgSrc.jsonValue(),
        imgParts = imgSrcValue.split('/'),
        member_id = imgParts[imgParts.length - 1].replace('.jpg', ''),
        center = await anchor.$('center'),
        bTags = await center.$$('b'),
        span = await center.$('span'),
        name = await bTags[0].evaluate(node => node.innerText),
        constituency = await bTags[1].evaluate(node => node.innerText),
        region = await span.evaluate(node => node.innerText),
        partyTag = await center.$('p'),
        partyValue = await partyTag.evaluate(node => node.innerText),
        profileUrl = (
            process.env['base_url'] + process.env['member_profile_seg'] +
            member_id
        );

    let nDetails = new Member(
        member_id, name, partyValue, constituency, region, imgSrcValue,
        profileUrl
    );
    mpDetails.push(nDetails.toJson());
  }
  return mpDetails;
}

export default scrapMembersPages;
