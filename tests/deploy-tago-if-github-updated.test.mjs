import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const scriptPath = new URL('../tools/deploy-tago-if-github-updated.sh', import.meta.url)
const schedulerPath = new URL('../tools/com.tago.site-deploy.plist', import.meta.url)
const schedulerInstallerPath = new URL('../tools/install-tago-deploy-scheduler.sh', import.meta.url)

test('GitHub deployment watcher records a revision only after successful server sync', () => {
  assert.equal(existsSync(scriptPath), true, 'deployment watcher script must exist')
  const script = readFileSync(scriptPath, 'utf8')

  assert.match(script, /branch="preview\/ten-post-migration"/)
  assert.match(script, /export HTTPS_PROXY="http:\/\/127\.0\.0\.1:7890"/)
  assert.match(script, /export ALL_PROXY="socks5:\/\/127\.0\.0\.1:7890"/)
  assert.match(script, /git ls-remote .*refs\/heads\/\$branch/)
  assert.match(script, /last-deployed/)
  assert.match(script, /deployment_checkout="\$HOME\/\.local\/share\/tago-deploy\/repo"/)
  assert.match(script, /git clone --single-branch --branch "\$branch"/)
  assert.doesNotMatch(script, /workspace has uncommitted changes/)
  assert.match(script, /npm run build:tago\nnpm test/)
  assert.match(script, /rm -f "\$deployment_checkout\/_multiconfig\.yml"/)
  assert.match(script, /rsync -a --delete/)
  assert.match(script, /printf '%s\\n' "\$remote_sha" > "\$state_file"/)
})

test('Tago deployment uses a daily macOS LaunchAgent at 08:40', () => {
  assert.equal(existsSync(schedulerPath), true, 'LaunchAgent plist must exist')
  assert.equal(existsSync(schedulerInstallerPath), true, 'LaunchAgent installer must exist')

  const plist = readFileSync(schedulerPath, 'utf8')
  const installer = readFileSync(schedulerInstallerPath, 'utf8')
  assert.match(plist, /top\.tago\.site-deploy/)
  assert.match(plist, /<integer>8<\/integer>/)
  assert.match(plist, /<integer>40<\/integer>/)
  assert.match(plist, /run-tago-deploy-scheduler\.sh/)
  assert.match(installer, /launchctl bootstrap/)
})
