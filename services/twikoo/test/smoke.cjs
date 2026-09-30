// Real upstream API contract test, private disposable disk storage, no administrator bootstrap.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');
const { spawn } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');
const { once } = require('node:events');

async function main() {
  process.umask(0o077);
  const data = fs.mkdtempSync(path.join(os.tmpdir(), 'ikarp-twikoo-smoke-'));
  const reservation = net.createServer();
  await new Promise((resolve, reject) => { reservation.once('error', reject); reservation.listen(0, '127.0.0.1', resolve); });
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const endpoint = `http://127.0.0.1:${port}`;
  const url = '/__twikoo_preview_verifier__/';
  let child;
  let accessToken;
  async function call(payload) {
    const response = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://127.0.0.1:4000' },
      body: JSON.stringify({ ...payload, ...(accessToken ? { accessToken } : {}) }), signal: AbortSignal.timeout(5000)
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('access-control-allow-origin'), 'http://127.0.0.1:4000');
    const result = await response.json();
    if (result.accessToken) accessToken = result.accessToken;
    assert.ok(!result.code, `API ${payload.event} failed with code ${result.code}`);
    return result;
  }
  async function start() {
    child = spawn(process.execPath, [path.join(__dirname, '../start.cjs')], {
      env: { ...process.env, TWIKOO_DATA: data, TWIKOO_PORT: String(port) },
      // Upstream error logs can contain request tokens. Never echo them.
      stdio: 'ignore'
    });
    let ready = false;
    for (let attempt = 0; attempt < 80; attempt++) {
      if (child.exitCode !== null) throw new Error(`Server exited: ${child.exitCode}`);
      try {
        const r = await fetch(endpoint, { signal: AbortSignal.timeout(500) });
        const health = await r.json();
        assert.equal(health.version, '1.7.24');
        assert.match(health.message, /Twikoo/);
        ready = true;
        console.log(JSON.stringify({ check: 'health', http_status: r.status, code: health.code, version: health.version, has_status_field: Object.hasOwn(health, 'status') }));
        break;
      } catch { await delay(100); }
    }
    assert.ok(ready, 'upstream is ready');
  }
  async function stop() {
    if (!child || child.exitCode !== null) return;
    const exiting = once(child, 'exit');
    child.kill('SIGTERM');
    const timer = setTimeout(() => child.kill('SIGKILL'), 10000);
    const [code, signal] = await exiting;
    clearTimeout(timer);
    child = null;
    assert.equal(code, 0, `shutdown signal: ${signal}`);
  }
  try {
    await start();
    const submitted = await call({ event: 'COMMENT_SUBMIT', url, href: `http://127.0.0.1:4000${url}`, nick: 'PreviewVerifier', mail: 'reserved@example.invalid', ua: 'TwikooLocalContractVerifier/1.0', comment: '<p>TWIKOO_LOCAL_SMOKE disposable verification</p>' });
    assert.ok(submitted.id, 'guest submission returns id without administrator setup');
    const page = await call({ event: 'COMMENT_GET', url });
    assert.equal(page.count, 1);
    assert.ok(page.data.some(item => item.id === submitted.id));
    const recent = await call({ event: 'GET_RECENT_COMMENTS', urls: [url], pageSize: 10, includeReply: false });
    assert.ok(recent.data.some(item => item.id === submitted.id));
    console.log(JSON.stringify({ check: 'guest_submit_read_recent', passed: true, count: page.count, recent_count: recent.data.length }));
    await stop();
    assert.ok(fs.readdirSync(data).length > 0, 'database files exist');
    await start();
    const persisted = await call({ event: 'COMMENT_GET', url });
    assert.ok(persisted.data.some(item => item.id === submitted.id));
    console.log(JSON.stringify({ check: 'disk_persistence_after_restart', passed: true }));
    const deleted = await call({ event: 'COMMENT_DELETE_FOR_USER', id: submitted.id });
    assert.equal(deleted.deleted, 1);
    assert.equal((await call({ event: 'COMMENT_GET', url })).count, 0);
    assert.equal((await call({ event: 'GET_RECENT_COMMENTS', urls: [url] })).data.length, 0);
    console.log(JSON.stringify({ check: 'own_guest_comment_cleanup', passed: true }));
  } finally {
    await stop();
    fs.rmSync(data, { recursive: true, force: true });
  }
}
main().catch(error => { console.error(JSON.stringify({ check: 'smoke', passed: false, message: error.message })); process.exitCode = 1; });
