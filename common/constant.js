import { existsSync } from 'fs';
import { join, dirname } from 'path';
function findRootDir(dir) {
    if (existsSync(join(dir, 'package.json'))) {
        return dir;
    }
    const parentDir = dirname(dir);
    if (dir === parentDir) {
        return dir;
    }
    return findRootDir(parentDir);
}
// Root paths
export const CWD = process.cwd();
export const ROOT = findRootDir(CWD);
export const HUSKY_DIRNAME = join(ROOT, '.husky');
export const PACKAGE_JSON_FILE = join(ROOT, 'package.json');
export const ESLINT_CONFIG_FILE = join(ROOT, '.eslintrc.js');
export const COMMITLINT_FILE = join(ROOT, 'commitlint.config.js');
export const PRETTIERC_FILE = join(ROOT, 'commitlint.config.js');
export const EDITOR_CONFIG_FILE = join(ROOT, '.editconfig');
export const CZ_CONFIG_RC_FILE = join(ROOT, '.cz-configrc.js');
export const CONFIG_EXTS = ['.js', '.yaml', '.json'];
export const esLint = 'eslint';
export const ts = 'ts';
export const editor = 'editor';
export const pre = 'pre';
export const husky = 'husky';
export const lintStaged = 'lintStaged';
export const commitLint = 'cmLint';
export const plop = 'plop';
export const VUE = 'VUE';
export const REACT = 'REACT';
export const WX_MINI = 'WX_MINI';
