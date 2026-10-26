import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const scriptPath = new URL('../tools/deploy-tago-if-github-updated.sh', import.meta.url)

test('GitHub deployment watcher records a revision only after successful server sync', () => {
  assert.equal(existsSync(scriptPath), true, 'deployment watcher script must exist')
  const script = readFileSync(scriptPath, 'utf8')

  assert.match(script, /branch="preview\/ten-post-migration"/)
  assert.match(script, /git ls-remote .*refs\/heads\/\$branch/)
  assert.match(script, /last-deployed/)
  assert.match(script, /deployment_checkout="\$HOME\/\.local\/share\/tago-deploy\/repo"/)
  assert.match(script, /git clone --single-branch --branch "\$branch"/)
  assert.doesNotMatch(script, /workspace has uncommitted changes/)
  assert.match(script, /npm run build:tago\nnpm test/)
  assert.match(script, /rsync -a --delete/)
  assert.match(script, /printf '%s\\n' "\$remote_sha" > "\$state_file"/)
})
