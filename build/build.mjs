import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';
import {exec} from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const root = dirname(__dirname);

await exec('npm run clean', {cwd: root});
await exec('npx parcel build source/manifest.json --no-content-hash --no-source-maps --dist-dir distribution --no-cache --detailed-report 0', {cwd: root});

// TODO zip distribution folder
