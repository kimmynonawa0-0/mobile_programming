// Run `node assets/brand/export.mjs` after editing geometry.js.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { emberLetters, emberMark } from './geometry.js';

const word = emberLetters.map(l => `<path transform="translate(${l.x},0)" d="${l.path}" fill="#f5f3ef" fill-rule="evenodd"/>`).join('');
const mark = `<path d="${emberMark}" fill="#f07842" fill-rule="evenodd"/>`;
const svg = (body, size = 1024) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">${body}</svg>`;
const symbol = `<g transform="translate(283,248) scale(4.4)">${mark}</g>`;
const icon = svg(`<rect width="1024" height="1024" fill="#000"/>${symbol}`);
const splash = svg(`<g transform="translate(366,142) scale(2.8)">${mark}</g><g transform="translate(167,568) scale(2.5)">${word}</g>`);
const folder = new URL('./', import.meta.url);
for (const [name, content] of Object.entries({ icon, splash, foreground: svg(symbol), monochrome: svg(symbol.replace('#f07842', '#ffffff')) })) {
  await writeFile(new URL(`${name}.svg`, folder), content);
  await sharp(Buffer.from(content)).png().toFile(fileURLToPath(new URL(`${name}.png`, folder)));
}
await sharp(Buffer.from(icon)).resize(64, 64).png().toFile(fileURLToPath(new URL('favicon.png', folder)));
await writeFile(new URL('wordmark.svg', folder), `<svg xmlns="http://www.w3.org/2000/svg" width="276" height="64" viewBox="0 0 276 64">${word}</svg>`);
console.log('EMBER vector and PNG assets exported.');
