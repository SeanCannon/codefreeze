'use strict';

const codefreeze = require('./codefreeze');

try {
  codefreeze();
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
