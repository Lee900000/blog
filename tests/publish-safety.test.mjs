import assert from 'node:assert/strict'
import test from 'node:test'

import {
  EXPECTED_ACCOUNT,
  PUBLISH_REPOSITORY,
  assertSafePublishContext,
  assertSensitivePagesExcluded
} from '../tools/publish-kary-source.mjs'

test('publishing is locked to the Kary source repository', () => {
  assert.equal(EXPECTED_ACCOUNT, 'kary2999')
  assert.equal(PUBLISH_REPOSITORY, 'https://github.com/kary2999/leon-blog-web.git')

  assert.doesNotThrow(() => assertSafePublishContext({
    account: 'kary2999',
    remote: PUBLISH_REPOSITORY,
    confirmation: 'kary2999/leon-blog-web'
  }))

  assert.throws(
    () => assertSafePublishContext({
      account: 'leon-book',
      remote: PUBLISH_REPOSITORY,
      confirmation: 'kary2999/leon-blog-web'
    }),
    /GitHub account/
  )

  assert.throws(
    () => assertSafePublishContext({
      account: 'kary2999',
      remote: 'https://github.com/leon-book/leon-book.github.io.git',
      confirmation: 'kary2999/leon-blog-web'
    }),
    /publish repository/
  )

  assert.throws(
    () => assertSafePublishContext({
      account: 'kary2999',
      remote: PUBLISH_REPOSITORY,
      confirmation: 'yes'
    }),
    /confirmation/
  )
})

test('publishing refuses generated sensitive article pages', () => {
  assert.doesNotThrow(() => assertSensitivePagesExcluded([
    'index.html',
    'index.php/archives/884.html'
  ]))

  assert.throws(
    () => assertSensitivePagesExcluded(['index.php/archives/237.html']),
    /237/
  )

  assert.throws(
    () => assertSensitivePagesExcluded(['index.php/archives/704.html']),
    /704/
  )
})
