'use strict';

const fs = require('fs');

const entries = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').map(Number).filter(Boolean);

for (let i = 0; i < entries.length; i++) {
  for (let j = i + 1; j < entries.length; j++) {
    for (let k = j + 1; k < entries.length; k++) {
      if (entries[i] + entries[j] + entries [k] === 2020) {
        console.log(entries[i] * entries[j] * entries[k]);
        process.exit(0);
      }
    }
  }
}
