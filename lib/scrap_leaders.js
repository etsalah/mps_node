import { TimeoutError } from 'puppeteer'
import Leader from '../models/leader.js'

async function scrapLeaders (page) {
  const url = process.env.base_url + process.env.leaders_url_seg
  try {
    await page.goto(url)
    return await getLeaders(page)
  } catch (e) {
    if (e.message === "Navigation timeout of 30000 ms exceeded") {
      console.log("navigation to page timed out")
      return []
    } else {
      console.log(`type of obj => ${ e instanceof TimeoutError }`)
      console.log("3. Unexpected error occurred")
      throw e
    }
  }
}

async function getLeaders (page) {
  const leaderCenterElements = await page.$$('td > center')
  const leaders = []
  for (const centerIndex in leaderCenterElements) {
    const leaderImgTag = await leaderCenterElements[centerIndex].$('img')

    if (leaderImgTag === null) {
      continue
    }
    const trialingImgSeg = await leaderImgTag.evaluate(
      (node) => node.src)
    const leaderImgUrl = trialingImgSeg
    const leaderImageSegs = trialingImgSeg.split('/')
    const leaderId = leaderImageSegs[
      leaderImageSegs.length - 1].replace('.jpg', '')
    const html = await leaderCenterElements[centerIndex].evaluate(
      (node) => node.innerText.split('\n'))

    const leader = Leader.build({ leaderId, name: html[1], title: html[2], photo: leaderImgUrl })

    try {
      await leader.save()
    } catch (e) {
      console.log('leader already exists')
    }
    leaders.push(leader.toJSON())
  }
  return leaders
}

export default scrapLeaders
