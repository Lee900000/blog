import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { verifyArticleRoutes } from '../tools/verify-article-routes.mjs';

test('all public articles, search and internal links use fixed opaque routes without legacy aliases', () => {
  verifyArticleRoutes(fileURLToPath(new URL('..', import.meta.url)));
});
