import {createServer} from 'node:http';
import {createReadStream} from 'node:fs';
import {readFile, stat} from 'node:fs/promises';
import {extname, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.xml': 'application/xml', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.mp4': 'video/mp4',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.txt': 'text/plain',
};

export async function serve(dir, {port = 0, prefix = '/', csp = false} = {}) {
  const root = resolve(dir);
  const policy = csp ? (await readFile(resolve(root, '.htaccess'), 'utf8')).match(/Header always set Content-Security-Policy "([^"]+)"/)?.[1] : '';
  if (csp && !policy) throw new Error('No CSP found in the build’s .htaccess');
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      if (!url.pathname.startsWith(prefix)) throw new Error('Path goes outside the build prefix');
      let file = resolve(root, decodeURIComponent(url.pathname.slice(prefix.length)));
      if (file !== root && !file.startsWith(root + sep)) throw new Error('Path goes outside the build');
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      const {size} = await stat(file);
      const headers = {'Content-Type': types[extname(file)] || 'application/octet-stream', 'Content-Length': size};
      if (policy && file.endsWith('.html')) headers['Content-Security-Policy'] = policy;
      response.writeHead(200, headers);
      const stream = createReadStream(file);
      stream.on('error', () => response.destroy());
      response.on('close', () => stream.destroy());
      stream.pipe(response);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise((ok, reject) => server.listen(port, '127.0.0.1', ok).on('error', reject));
  return {
    origin: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise(ok => { server.close(ok); server.closeAllConnections(); }),
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [port, dir, prefix] = process.argv.slice(2);
  console.log((await serve(dir, {port:Number(port), prefix})).origin);
}
