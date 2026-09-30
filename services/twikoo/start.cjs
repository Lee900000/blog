'use strict';
process.umask(0o077);
try {
  Object.assign(process.env, require('./local-config.cjs').configure());
  require('tkserver/server.js');
} catch (error) {
  process.stderr.write(JSON.stringify({ service: 'twikoo_local', level: 'ERROR', message: error.message }) + '\n');
  process.exitCode = 1;
}
