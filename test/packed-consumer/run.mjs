import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const projectRoot = resolve(import.meta.dirname, '../..');
const temporaryRoot = mkdtempSync(join(tmpdir(), 'pictures-packed-consumer-'));
const packDirectory = join(temporaryRoot, 'pack');
const consumerDirectory = join(temporaryRoot, 'consumer');
mkdirSync(packDirectory);
mkdirSync(consumerDirectory);

const execute = (command, args, options = {}) =>
  execFileSync(command, args, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: 'inherit',
    ...options
  });

try {
  const packOutput = execFileSync(
    'npm',
    ['pack', '--ignore-scripts', '--json', '--pack-destination', packDirectory],
    { cwd: projectRoot, encoding: 'utf8' }
  );
  const pack = JSON.parse(packOutput)[0];
  const tarball = join(packDirectory, pack.filename);

  writeFileSync(
    join(consumerDirectory, 'package.json'),
    `${JSON.stringify({ name: 'pictures-packed-consumer', private: true, type: 'module' })}\n`
  );
  cpSync(join(projectRoot, 'test/fixtures/input.png'), join(consumerDirectory, 'input.png'));
  cpSync(join(import.meta.dirname, 'typecheck.ts'), join(consumerDirectory, 'typecheck.ts'));
  cpSync(join(import.meta.dirname, 'tsconfig.json'), join(consumerDirectory, 'tsconfig.json'));

  execute(
    'npm',
    [
      'install',
      '--prefix',
      consumerDirectory,
      tarball,
      '--ignore-scripts',
      '--no-audit',
      '--no-fund'
    ],
    { cwd: consumerDirectory }
  );

  const installedRoot = join(consumerDirectory, 'node_modules/pictures-operator');
  const installedPackage = JSON.parse(readFileSync(join(installedRoot, 'package.json'), 'utf8'));
  if (
    installedPackage.version !== pack.version ||
    Object.keys(installedPackage.dependencies ?? {}).length
  ) {
    throw new Error('Installed package metadata does not match the packed package');
  }

  execute(
    process.execPath,
    [
      '--input-type=module',
      '--eval',
      "import { PictureFormat, PicturesOperator } from 'pictures-operator'; if (!PictureFormat || !PicturesOperator) process.exit(1)"
    ],
    { cwd: consumerDirectory }
  );
  execute(process.execPath, [
    join(projectRoot, 'node_modules/typescript/bin/tsc'),
    '-p',
    join(consumerDirectory, 'tsconfig.json')
  ]);
  if (process.env.PACKED_CONSUMER_SKIP_BROWSER !== '1') {
    execute(process.execPath, [join(import.meta.dirname, 'browser-check.mjs')], {
      env: { ...process.env, PACKED_CONSUMER_ROOT: consumerDirectory }
    });
  }

  console.log(
    `Packed consumer passed: ${pack.filename}, ${pack.entryCount} files, ${pack.unpackedSize} bytes unpacked`
  );
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
