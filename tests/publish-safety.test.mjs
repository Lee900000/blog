import assert from 'node:assert/strict'
import test from 'node:test'

import {
  EXPECTED_ACCOUNT,
  PUBLISH_REPOSITORY,
  assertSafePublishContext,
  assertSensitivePagesExcluded
} from '../tools/publish-kary-source.mjs'

test('publishing is locked to the Kary source repository', () => {
  assert.equal(EXPECTED_ACCOUNT, 'Lee900000')
  assert.equal(PUBLISH_REPOSITORY, 'https://github.com/Lee900000/blog.git')

  assert.doesNotThrow(() => assertSafePublishContext({
    account: 'Lee900000',
    remote: PUBLISH_REPOSITORY,
    confirmation: 'Lee900000/blog'
  }))

  assert.throws(
    () => assertSafePublishContext({
      account: 'leon-book',
      remote: PUBLISH_REPOSITORY,
      confirmation: 'Lee900000/blog'
    }),
    /GitHub account/
  )

  assert.throws(
    () => assertSafePublishContext({
      account: 'Lee900000',
      remote: 'https://github.com/leon-book/leon-book.github.io.git',
      confirmation: 'Lee900000/blog'
    }),
    /publish repository/
  )

  assert.throws(
    () => assertSafePublishContext({
      account: 'Lee900000',
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
