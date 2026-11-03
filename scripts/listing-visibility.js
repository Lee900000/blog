'use strict';

// Filter only list-generation inputs. Keep direct routes, search and menus intact.
hexo.extend.filter.register('before_generate', () => {
  for (const name of ['index', 'archive']) {
    const generate = require(`hexo-generator-${name}/lib/generator`);
    hexo.extend.generator.register(name, function (locals) {
      return generate.call(this, {
        ...locals,
        posts: locals.posts.filter(post => post.listed !== false)
      });
    });
  }
}, 30);
