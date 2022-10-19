import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
import fs from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const root = dirname(__dirname);

await fs.rm(join(root, 'distribution'), {recursive: true, force: true});
