import PCR from 'puppeteer-chromium-resolver'
import { Sequelize } from 'sequelize'
import * as dotenv from 'dotenv'

dotenv.config()

async function getBrowserAndPageObject () {
  const option = {
    revision: '',
    detectionPath: '',
    folderName: '.chromium-browser-snapshots',
    defaultHosts: [
      'https://storage.googleapis.com',
      'https://npm.taobao.org/mirrors'
    ],
    hosts: [],
    cacheRevisions: 2,
    retry: 3,
    silent: false
  }
  const stats = await PCR(option)
  const browser = await stats.puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
    executablePath: stats.executablePath
  }).catch(function (error) {
    console.log(error)
  })
  const page = await browser.newPage()
  return { browser, page }
}

function getSequelizeObj () {
  return new Sequelize({
    dialect: process.env.database_dialect,
    storage: process.env['PWD'] + "/" + process.env.database_url})
}

export {
  getBrowserAndPageObject, getSequelizeObj
}
