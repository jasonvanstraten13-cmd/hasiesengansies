// Minimal local server: serves the static site and runs the /api functions, no install needed.
// Usage: npm start  (reads .env if present). `npx netlify dev` works too and mirrors production more closely.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT) || 8888;
if (fs.existsSync(path.join(root, '.env'))) process.loadEnvFile(path.join(root, '.env'));
process.env.SITE_URL ||= `http://localhost:${port}`;

const functions = {
  '/api/create-checkout': 'netlify/functions/create-checkout.mjs',
  '/api/yoco-webhook': 'netlify/functions/yoco-webhook.mjs',
  '/api/contact': 'netlify/functions/contact.mjs'
};
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain' };

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  if (functions[url.pathname]) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const { default: handler } = await import(pathToFileURL(path.join(root, functions[url.pathname])).href);
    const response = await handler(new Request(url, { method: req.method, headers: req.headers, body: req.method === 'GET' ? undefined : Buffer.concat(chunks) }));
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
    return;
  }
  let file = path.normalize(path.join(root, decodeURIComponent(url.pathname)));
  if (!file.startsWith(root) || file.includes(`${path.sep}netlify${path.sep}`)) { res.writeHead(404).end('Not found'); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end('Not found'); return; }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Hasies en Gansies running at http://localhost:${port}/`));
