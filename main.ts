// HomeLedger — a household budget site, handed in as a make.fun entry
// (Node 22, standard library only). The site is this directory's app/ folder:
// plain static files a browser opens at app/index.html (ES modules, CSS, no
// build step, no network request), its content held in its own files. This
// program copies app/ and screenshots/ from beside this file to /output and
// writes /output/dossier.json, the summary the judge reads (the screenshots,
// the first load's files and bytes, and the source), with the vendored
// make.fun library. Leave vendor/makefun-frontend.ts as it is: the scorer
// requires dossier.json to be byte for byte what its own copy writes.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail loudly before copying anything if the entry is incomplete: the
// scorer refuses an entry with no screenshots, and a missing app/ would
// hand in an empty site.
if (!existsSync(join(here, 'app', 'index.html'))) throw new Error('missing app/index.html');
if (!existsSync(join(here, 'screenshots'))) throw new Error('missing screenshots/');
const shotFiles = readdirSync(join(here, 'screenshots')).filter((name) => !name.startsWith('.'));
if (shotFiles.length < 3 || shotFiles.length > 4) throw new Error(`expected 3 or 4 screenshots, found ${shotFiles.length}`);

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/
// or 16 MiB of app files: app/ counts beside /output's own 1000-entry cap,
// its screenshots/ and dossier.json).
const dossier = buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 });
writeFileSync(join(out, 'dossier.json'), dossier);

// Check the dossier is what it claims to be before reporting success: it
// must parse as JSON and stay under the scorer's 1.5 MiB cap. A corrupt or
// oversized dossier would fail the gate after the entry is submitted.
// (buildDossier returns bytes, not a string, so decode it first.)
const dossierBytes = Buffer.from(dossier).length;
const dossierText = Buffer.from(dossier).toString('utf8');
const parsed = JSON.parse(dossierText);
if (typeof parsed !== 'object' || parsed === null) throw new Error('dossier.json did not parse to an object');
if (dossierBytes > 1572864) throw new Error(`dossier.json is ${dossierBytes} bytes, over the 1.5 MiB cap`);

// A deterministic summary on stdout, so two runs can be compared byte for
// byte: file counts and sizes only, nothing time-dependent.
function countFiles(dir) {
  let files = 0;
  let bytes = 0;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, name.name);
    if (name.isDirectory()) {
      const sub = countFiles(path);
      files += sub.files;
      bytes += sub.bytes;
    } else if (name.isFile()) {
      files += 1;
      bytes += statSync(path).size;
    }
  }
  return { files, bytes };
}

const appCount = countFiles(join(out, 'app'));
const shotCount = countFiles(join(out, 'screenshots'));
console.log(`homeledger: app ${appCount.files} files ${appCount.bytes} bytes; screenshots ${shotCount.files} files ${shotCount.bytes} bytes; dossier ${dossierBytes} bytes`);
