import express from 'express'
import * as dotenv from 'dotenv'

import { getBrowserAndPageObject } from './lib/main.js'
import scrapLeaders from './lib/scrap_leaders.js'
import scrapMembersPages from './lib/scrap_members.js'

dotenv.config()

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/leaders', async (req, res) => {
  try {
    const { browserObj, pageObj } = await getBrowserAndPageObject()
    console.log(browserObj, pageObj)
    res.send(scrapLeaders(pageObj))
    browserObj.close()
  } catch (e) {
    res.send(e)
  }
})

app.get('/mps', async (req, res) => {
  try {
    const { browserObj, pageObj } = await getBrowserAndPageObject()
    res.send(scrapMembersPages(pageObj))
    browserObj.close()
  } catch (e) {
    res.send(e)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
