const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function configure(source = process.env) {
  if (source.MONGODB_URI || source.MONGO_URL) throw new Error('Mongo configuration is not allowed for this local-file service');
  const repository = fs.realpathSync(path.resolve(__dirname, '../..'));
  const data = path.resolve(source.TWIKOO_DATA || path.join(os.homedir(), '.local/share/ikarp-blog-twikoo'));
  const inside = (target) => target === repository || target.startsWith(repository + path.sep);
  if (inside(data)) throw new Error('TWIKOO_DATA must be outside the repository');
  const port = source.TWIKOO_PORT || '8089';
  if (!/^\d+$/.test(port) || Number(port) < 1024 || Number(port) > 65535) throw new Error('Invalid local port');
  // Resolve existing ancestors before creating directories (also catches symlinked parents).
  let ancestor = data;
  while (!fs.existsSync(ancestor)) ancestor = path.dirname(ancestor);
  if (inside(fs.realpathSync(ancestor))) throw new Error('TWIKOO_DATA must be outside the repository');
  fs.mkdirSync(data, { recursive: true, mode: 0o700 });
  fs.chmodSync(data, 0o700);
  return { ...source, TWIKOO_HOST: '127.0.0.1', TWIKOO_PORT: port, TWIKOO_DATA: fs.realpathSync(data), TWIKOO_LOG_LEVEL: 'warn' };
}
module.exports = { configure };
