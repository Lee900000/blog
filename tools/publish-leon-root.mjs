// [skill: dev-dna] 使用显式校验、最小依赖和失败即停止的发布流程。
import { existsSync, readdirSync, rmSync } from 'node:fs'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'
import { verifyArticleRoutes } from './verify-article-routes.mjs'

export const EXPECTED_ACCOUNT = 'leon-book'
export const PUBLISH_REPOSITORY = 'https://github.com/leon-book/leon-book.github.io.git'
export const REQUIRED_CONFIRMATION = 'leon-book.github.io'
const BLOCKED_ARTICLE_IDS = ['237', '704']

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: 'utf8',
    stdio: options.capture ? 'pipe' : 'inherit'
  })
  if (result.status !== 0) {
    const details = options.capture ? `\n${result.stderr || result.stdout}` : ''
    throw new Error(`${command} ${args.join(' ')} failed${details}`)
  }
  return options.capture ? result.stdout.trim() : ''
}

export function assertSafePublishContext({ account, remote, confirmation }) {
  if (account !== EXPECTED_ACCOUNT) {
    throw new Error(`Wrong GitHub account: expected ${EXPECTED_ACCOUNT}, received ${account || '(none)'}`)
  }
  if (remote !== PUBLISH_REPOSITORY) {
    throw new Error(`Wrong publish repository: expected ${PUBLISH_REPOSITORY}`)
  }
  if (confirmation !== REQUIRED_CONFIRMATION) {
    throw new Error(`Wrong confirmation: pass --confirm ${REQUIRED_CONFIRMATION}`)
  }
}

export function assertSensitivePagesExcluded(paths) {
  for (const articleId of BLOCKED_ARTICLE_IDS) {
    const match = paths.find(path => new RegExp(`(^|/)archives/${articleId}(?:\\.html|/|$)`).test(path))
    if (match) throw new Error(`Blocked article ${articleId} exists in generated output: ${match}`)
  }
}

function listFiles(root) {
  const files = []
  const visit = directory => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const fullPath = join(directory, entry.name)
      if (entry.isDirectory()) visit(fullPath)
      else files.push(relative(root, fullPath))
    }
  }
  visit(root)
  return files
}

async function main() {
  const workspace = resolve(fileURLToPath(new URL('..', import.meta.url)))
  const confirmation = process.argv[2] === '--confirm' ? process.argv[3] : ''
  const account = run('gh', ['api', 'user', '--jq', '.login'], { cwd: workspace, capture: true })
  assertSafePublishContext({ account, remote: PUBLISH_REPOSITORY, confirmation })

  const status = run('git', ['status', '--porcelain'], { cwd: workspace, capture: true })
  if (status) throw new Error('Workspace is not clean. Commit reviewed source changes before publishing.')

  run('npm', ['test'], { cwd: workspace })
  run('npm', ['run', 'build:leon-root'], { cwd: workspace })

  const publicDirectory = join(workspace, 'public')
  if (!existsSync(join(publicDirectory, 'index.html'))) {
    throw new Error('Generated public/index.html is missing')
  }
  assertSensitivePagesExcluded(listFiles(publicDirectory))
  verifyArticleRoutes(workspace)

  const temporaryRoot = await mkdtemp(join(tmpdir(), 'leon-blog-publish-'))
  const checkout = join(temporaryRoot, 'site')
  try {
    run('git', ['clone', '--depth', '1', PUBLISH_REPOSITORY, checkout])
    const clonedRemote = run('git', ['remote', 'get-url', 'origin'], { cwd: checkout, capture: true })
    assertSafePublishContext({ account, remote: clonedRemote, confirmation })

    run('rsync', ['-a', '--delete', '--exclude', '.git/', `${publicDirectory}/`, `${checkout}/`])
    run('git', ['add', '--all'], { cwd: checkout })
    const changes = run('git', ['status', '--porcelain'], { cwd: checkout, capture: true })
    if (!changes) {
      console.log('No generated-site changes to publish.')
      return
    }

    run('git', ['commit', '-m', 'chore(pages): publish Leon blog'], { cwd: checkout })
    run('git', ['push', 'origin', 'HEAD:main'], { cwd: checkout })
    console.log('Published to https://leon-book.github.io/')
  } finally {
    rmSync(temporaryRoot, { recursive: true, force: true })
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main().catch(error => {
    console.error(error.message)
    process.exitCode = 1
  })
}
