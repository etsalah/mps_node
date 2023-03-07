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
    const leaderImgUrl = trialingImgSeg
    const leaderImageSegs = trialingImgSeg.split('/')
    const leaderId = leaderImageSegs[
      leaderImageSegs.length - 1].replace('.jpg', '')
    const html = await leaderCenterElements[centerIndex].evaluate(
      (node) => node.innerText.split('\n'))

    const leader = Leader.build({
      leaderId: leaderId, name: html[1], title: html[2], photo: leaderImgUrl})

    leader.save().catch((err) => console.log("leader already exissts in database"))
    leaders.push(leader.toJSON())
  }
  return leaders
}

export default scrapLeaders
