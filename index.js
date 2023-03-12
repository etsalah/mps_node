import express from 'express'
import * as dotenv from 'dotenv'

import { Op } from 'sequelize'
import Leader from './models/leader.js'
import Member from './models/member.js'

dotenv.config()

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/leaders', async (req, res) => {
  try {
    res.send(await Leader.findAll())
  } catch (e) {
    res.send(e)
  }
})

app.get('/members', async (req, res) => {
  const party = req.query.party
  const region = req.query.region
  let queryParams = []

  if (party !== null && party !== undefined) {
    queryParams.push({ party })
  }
  if (region !== null && region !== undefined) {
    queryParams.push({ region })
  }

  const paramsProvided = (queryParams !== null && queryParams !== undefined)
  if (paramsProvided && queryParams.length === 1) {
    queryParams = {
      where: queryParams[0]
    }
  } else if (paramsProvided && queryParams.length > 1) {
    queryParams = {
      where: {
        [Op.and]: queryParams
      }
    }
  } else {
    queryParams = {}
  }
  try {
    res.send(await Member.findAll(queryParams))
  } catch (e) {
    res.send(e)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
