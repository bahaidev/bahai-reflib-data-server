#!/usr/bin/env node

import createServer from './server/index.js';

const port = process.argv[2] || 1844;

const app = createServer({
  statik: 'public'
});

app.listen(port);

// eslint-disable-next-line no-console -- CLI
console.log('Bahá\'í Reflib Data Server started: Port ' + port);
