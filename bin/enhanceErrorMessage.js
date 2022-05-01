import  {Command} from 'commander'
import chalk from 'chalk'
export const nishi = ()=>{

}
export default  (methodName, log) => {
  Command.prototype[methodName] = function (...args) {
    if (methodName === 'unknownOption' && this._allowUnknownOption) {
      return
    }
    this.outputHelp()
    console.log(`  ` + chalk.red(log(...args)))
    console.log()
    process.exit(1)
  }
}
