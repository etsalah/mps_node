import Leader from '../models/leader.js'

async function scrapLeaders (page) {
  const url = process.env.base_url + process.env.leaders_url_seg
  await page.goto(url)
  return await getLeaders(page)
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
    const leaderImgUrl = (
      process.env.base_url + '/' + trialingImgSeg
    )
    const leaderImageSegs = trialingImgSeg.split('/')
    const leaderId = leaderImageSegs[
      leaderImageSegs.length - 1].replace('.jpg', '')
    const html = await leaderCenterElements[centerIndex].evaluate(
      (node) => node.innerText.split('\n'))

    const leader = new Leader(leaderId, html[1], html[2], leaderImgUrl)
    leaders.push(leader.toJson())
  }
  return leaders
}

export default scrapLeaders
