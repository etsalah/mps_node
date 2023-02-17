import { parseArgs } from 'node:util'
import * as dotenv from 'dotenv'

import scrapMembersPages from './lib/scrap_members.js'
import scrapLeaders from './lib/scrap_leaders.js'
import { getBrowserAndPageObject } from './lib/main.js'

dotenv.config()

const options = {
  op: {
    type: 'string',
    short: 'o'
  }
}

async function main (commandLineArgs) {
  const { op } = commandLineArgs
  const opFunctions = {
    help: printHelp,
    mps: scrapMembersPages,
    leaders: scrapLeaders
  }
  const func = opFunctions[op]

  if (op === 'help' || (func === null || func === undefined)) {
    printHelp(op, opFunctions)
    return
  }

  const { browser, page } = await getBrowserAndPageObject()

  const result = await func(page)
  console.log(result)
  await browser.close()
};

function printHelp (cmd, allowedCommands) {
  const cmdLst = []
  let allowedCmdStr = ''

  for (const cmd in allowedCommands) {
    cmdLst.push(cmd)
  }
  allowedCmdStr = cmdLst.reduce((elem1, elem2) => `${elem1}, ${elem2}`)
  console.log(
    `${cmd} is not part of the supported operation. [${allowedCmdStr}] ` +
    'are the supported operations')
};

const cmdArgs = process.argv
const { values } = parseArgs({ cmdArgs, options })
await main(values)
