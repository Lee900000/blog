const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

test('launcher fixes loopback and stores private data outside repository', () => {
  const modulePath = path.join(__dirname, '../local-config.cjs');
  assert.ok(fs.existsSync(modulePath), 'local-only configuration is implemented');
  const { configure } = require(modulePath);
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'twikoo-config-'));
  try {
    const data = path.join(base, 'data');
    const env = configure({ TWIKOO_DATA: data, TWIKOO_HOST: '0.0.0.0' });
    assert.equal(env.TWIKOO_HOST, '127.0.0.1');
    assert.equal(env.TWIKOO_PORT, '8089');
    assert.equal(env.TWIKOO_DATA, fs.realpathSync(data));
    assert.equal(fs.statSync(data).mode & 0o777, 0o700);
    assert.throws(() => configure({ MONGODB_URI: 'blocked' }), /Mongo/);
    assert.throws(() => configure({ MONGO_URL: 'blocked' }), /Mongo/);
    assert.throws(() => configure({ TWIKOO_DATA: path.join(__dirname, 'data') }), /outside/);
    assert.throws(() => configure({ TWIKOO_PORT: '0' }), /port/);
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});
