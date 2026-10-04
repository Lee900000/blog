import assert from 'node:assert/strict'
import test from 'node:test'

import {
  EXPECTED_ACCOUNT,
  PUBLISH_REPOSITORY,
  assertSafePublishContext,
  assertSensitivePagesExcluded
} from '../tools/publish-leon-root.mjs'

test('publishing is locked to the Leon account and root Pages repository', () => {
  assert.equal(EXPECTED_ACCOUNT, 'leon-book')
  assert.equal(PUBLISH_REPOSITORY, 'https://github.com/leon-book/leon-book.github.io.git')

  assert.doesNotThrow(() => assertSafePublishContext({
    account: 'leon-book',
    remote: PUBLISH_REPOSITORY,
    confirmation: 'leon-book.github.io'
  }))

  assert.throws(
    () => assertSafePublishContext({
      account: 'kary2999',
      remote: PUBLISH_REPOSITORY,
      confirmation: 'leon-book.github.io'
    }),
    /GitHub account/
  )

  assert.throws(
    () => assertSafePublishContext({
      account: 'leon-book',
      remote: 'https://github.com/leon-book/blog.git',
      confirmation: 'leon-book.github.io'
    }),
    /publish repository/
  )

  assert.throws(
    () => assertSafePublishContext({
      account: 'leon-book',
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
