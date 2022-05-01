import semver from 'semver';
import stripAnsi from 'strip-ansi';
import { execaSync, execa } from 'execa';
import chalk from 'chalk';
import { hasYarn, hasProjectYarn, hasPnpm3OrLater, hasPnpmVersionOrLater, hasProjectPnpm, hasProjectNpm, } from './env.js';
const SUPPORTED_PACKAGE_MANAGERS = ['yarn', 'pnpm', 'npm'];
const PACKAGE_MANAGER_PNPM4_CONFIG = {
    install: ['install', '--reporter', 'silent', '--shamefully-hoist'],
    add: ['install', '--reporter', 'silent', '--shamefully-hoist'],
    upgrade: ['update', '--reporter', 'silent'],
    remove: ['uninstall', '--reporter', 'silent'],
    global: ['add', '-g', '--loglevel', 'error']
};
const PACKAGE_MANAGER_PNPM3_CONFIG = {
    install: ['install', '--loglevel', 'error', '--shamefully-flatten'],
    add: ['install', '--loglevel', 'error', '--shamefully-flatten'],
    upgrade: ['update', '--loglevel', 'error'],
    remove: ['uninstall', '--loglevel', 'error'],
    global: ['add', '-g', '--loglevel', 'error']
};
const PACKAGE_MANAGER_CONFIG = {
    npm: {
        install: ['install', '--loglevel', 'error'],
        add: ['install', '--loglevel', 'error'],
        upgrade: ['update', '--loglevel', 'error'],
        remove: ['uninstall', '--loglevel', 'error'],
        global: ['install', '-g', '--loglevel', 'error']
    },
    pnpm: hasPnpmVersionOrLater('4.0.0') ? PACKAGE_MANAGER_PNPM4_CONFIG : PACKAGE_MANAGER_PNPM3_CONFIG,
    yarn: {
        install: [],
        add: ['add'],
        upgrade: ['upgrade'],
        remove: ['remove'],
        global: ['global add']
    }
};
const executeCommand = function executeCommand(command, args, cwd) {
    return new Promise((resolve, reject) => {
        const apiMode = process.env.VUE_CLI_API_MODE;
        if (apiMode) {
            if (command === 'npm') {
                // TODO when this is supported
            }
            else if (command === 'yarn') {
                args.push('--json');
            }
        }
        const child = execa(command, args, {
            cwd,
            stdio: ['inherit', 'inherit', 'pipe']
        });
        if (command === 'yarn') {
            child.stdout?.on('data', (buf) => {
                const str = buf.toString();
                if (/warning/.test(str)) {
                    return;
                }
                // progress bar
                const progressBarMatch = str.match(/\[.*\] (\d+)\/(\d+)/);
                if (progressBarMatch) {
                    // since yarn is in a child process, it's unable to get the width of
                    // the terminal. reimplement the progress bar ourselves!
                    // renderProgressBar(progressBarMatch[1], progressBarMatch[2])
                    return;
                }
                process.stderr.write(buf);
            });
        }
        child.stderr?.on('close', (code) => {
            if (code) {
                reject(new Error(`command failed: ${command} ${args.join(' ')}`));
                return;
            }
            resolve();
        });
    });
};
class PackageManager {
    context = '';
    bin = 'npm';
    needsPeerDepsFix = false;
    constructor(ctx = '') {
        this.context = ctx || process.cwd();
        if (hasProjectYarn(ctx)) {
            this.bin = 'yarn';
        }
        else if (hasProjectPnpm(ctx)) {
            this.bin = 'pnpm';
        }
        else if (hasProjectNpm(ctx)) {
            this.bin = 'npm';
        }
        if (!this.bin) {
            this.bin = hasYarn() ? 'yarn' : hasPnpm3OrLater() ? 'pnpm' : 'npm';
        }
        if (this.bin === 'npm') {
            // npm doesn't support package aliases until v6.9
            const MIN_SUPPORTED_NPM_VERSION = '6.9.0';
            const npmVersion = stripAnsi(execaSync('npm', ['--version']).stdout);
            if (semver.lt(npmVersion, MIN_SUPPORTED_NPM_VERSION)) {
                throw new Error('You are using an outdated version of NPM.\n' +
                    'It does not support some core functionalities of Vue CLI.\n' +
                    'Please upgrade your NPM version.');
            }
            if (semver.gte(npmVersion, '7.0.0')) {
                this.needsPeerDepsFix = true;
            }
            if (!SUPPORTED_PACKAGE_MANAGERS.includes(this.bin)) {
                console.warn(`The package manager ${chalk.red(this.bin)} is ${chalk.red('not officially supported')}.\n` +
                    `It will be treated like ${chalk.cyan('npm')}, but compatibility issues may occur.\n` +
                    `See if you can use ${chalk.cyan('--registry')} instead.`);
                PACKAGE_MANAGER_CONFIG[this.bin] = PACKAGE_MANAGER_CONFIG.npm;
            }
        }
    }
    async install() {
        const args = [];
        if (this.needsPeerDepsFix) {
            args.push('--legacy-peer-deps');
        }
        return await this.runCommand('install', args);
    }
    async global(packages = []) {
        let args = [];
        args = args.concat(packages);
        if (this.needsPeerDepsFix) {
            args.push('--legacy-peer-deps');
        }
        return await this.runCommand('global', args);
    }
    async runCommand(command, args) {
        await executeCommand(this.bin, [
            ...PACKAGE_MANAGER_CONFIG[this.bin][command],
            ...(args || [])
        ], this.context);
    }
}
export { PackageManager };
