import { TimeoutError } from 'puppeteer-core'
import Member from '../models/member.js'

async function scrapMembersPages (page) {
  const url = process.env.base_url + process.env.members_url_seg

  await page.goto(url)

  const pageUrls = await getPages(page)
  let mpCards = await page.$$('.mpcard')
  const mpDetails = { 0: await getMembers(mpCards) }

  for (let i = 1; i < pageUrls.length; i++) {
    try {
      await page.goto(pageUrls[i])
      mpCards = await page.$$('.mpcard')
      mpDetails[i] = await getMembers(mpCards)
    } catch (e) {

      if (e.message === "Navigation timeout of 30000 ms exceeded") {
        console.log("navigation to next page fails")
        continue
      } else {
        console.log(`error message => #${ e.message }#`)
        console.log("2. Unexpected error occurred")
        throw e
      }
    }
  }
  return mpDetails
}

async function getPages (page) {
  const memberPages = await page.$$('.square')
  const pageAnchors = memberPages.map((node) => node.evaluate(node => node.href))
  const pageUrls = []

  for (const pageIndex in pageAnchors) {
    const t = await pageAnchors[pageIndex]
    pageUrls.push(t)
  }
  return pageUrls
}

async function getMembers (mpCards) {
  const mpDetails = []
  for (const cardIndex in mpCards) {
    const anchor = await mpCards[cardIndex].$('a')
    const img = await anchor.$('img')
    const imgElem = await img.asElement()
    const imgSrc = await imgElem.getProperty('src')
    const imgSrcValue = await imgSrc.jsonValue()
    const imgParts = imgSrcValue.split('/')
    const memberId = imgParts[imgParts.length - 1].replace('.jpg', '')
    const center = await anchor.$('center')
    const bTags = await center.$$('b')
    const span = await center.$('span')
    const name = await bTags[0].evaluate(node => node.innerText)
    const constituency = await bTags[1].evaluate(node => node.innerText)
    const region = await span.evaluate(node => node.innerText)
    const partyTag = await center.$('p')
    const partyValue = await partyTag.evaluate(node => node.innerText)
    const profileUrl = (
      process.env.base_url + process.env.member_profile_seg +
            memberId
    )

    const nDetails = Member.build({
      memberId,
      name,
      party: partyValue,
      constituency,
      region,
      photo: imgSrcValue,
      profile: profileUrl
    })

    try {
      await nDetails.save()
    } catch (e) {
      console.log('member already present in the database')
    }
    mpDetails.push(nDetails.toJSON())
  }
  return mpDetails
}

export default scrapMembersPages
