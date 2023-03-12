import { scheduleJob, gracefulShutdown } from 'node-schedule'

import scrapLeaders from './lib/scrap_leaders.js'
import scrapMembers from './lib/scrap_members.js'
import { getBrowserAndPageObject } from './lib/main.js'

const run = async function () {
  const { browser, page } = await getBrowserAndPageObject()
  await scrapLeaders(page)
  await scrapMembers(page)
  await browser.close()
}

scheduleJob('* * 6 * * *', async function () {
  await run()
})

scheduleJob('* * 12 * * *', async function () {
  await run()
})

process.on('SIGINT', function () {
  gracefulShutdown().then(() => process.exit(0))
})
