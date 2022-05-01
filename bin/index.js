#! /usr/bin/env node
import fs from 'fs'
import { URL, fileURLToPath } from 'url'
import enhanceErrorMessages from './enhanceErrorMessage.js'
import chalk from 'chalk'
import leven from 'leven'
import { promptIndex, promptSingleConfig } from '../lib/commands/index.js'
import { Command } from 'commander'
const packagePath = fileURLToPath(new URL('../package.json', import.meta.url))
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
const program = new Command()
program.version(`standard-cli ${packageJson.version}`).usage('<command> [options]')
program
  .command('create')
  .description('创建项目配置项')
  .action(() => {
    promptIndex()
  })
program
  .command('add')
  .argument('<conType>', '创建配置项,支持选项有eslint、husky、ts、cmLint、editor、prettier、plop')
  .allowUnknownOption()
  .action((conType) => {
    promptSingleConfig(conType)
  })

enhanceErrorMessages('missingArgument', (argName) => {
  return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`
})

enhanceErrorMessages('unknownOption', (optionName) => {
  return `Unknown option ${chalk.yellow(optionName)}.`
})

enhanceErrorMessages('optionMissingArgument', (option, flag) => {
  return `Missing required argument for option ${chalk.yellow(option.flags)}` + (flag ? `, got ${chalk.yellow(flag)}` : ``)
})

/**
 * @description 建议使用命令
 * @param
 */
function suggestCommands(unknownCommand) {
  const availableCommands = program.commands.map((cmd) => cmd._name)

  let suggestion

  availableCommands.forEach((cmd) => {
    const isBestMatch = leven(cmd, unknownCommand) < leven(suggestion || '', unknownCommand)
    if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
      suggestion = cmd
    }
  })

  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`))
  }
}

program.on('command:*', ([cmd]) => {
  program.outputHelp()
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
  console.log()
  suggestCommands(cmd)
  process.exitCode = 1
})
program.parse(process.argv)
