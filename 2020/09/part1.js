'use strict';

const fs = require('fs');

const lines = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').map(Number).filter(Boolean);
const preambleLength = 25;
let lineIsValid

for (let i = preambleLength; i < lines.length; i++) {
  for (let j = i - preambleLength; j < i; j++) {
    for (let k = j + 1; k < i; k++) {
      if (lines[j] + lines[k] === lines[i]) {
        lineIsValid = true;
        k = i;
      }
    }

    if (lineIsValid) j = i;
  }

  if (!lineIsValid) {
    console.log(lines[i]);
    process.exit(0);
  } else {
    lineIsValid = false;
  }
}
