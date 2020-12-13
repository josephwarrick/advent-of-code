'use strict';

const fs = require('fs');

const lines = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').map(Number).filter(Boolean);
const target = 144381670; // output of part1.js
let sum = 0;
let min;
let max;

for (let i = 0; i < lines.length; i++) {
  for (let j = i; j < lines.length; j++) {
    sum += lines[j];

    if (sum === target) {
      min = i;
      max = j;
      j = lines.length;
      i = lines.length;
    }
  }

  sum = 0
}

const range = lines.slice(min, max);
const minNum = Math.min.apply(Math, range);
const maxNum = Math.max.apply(Math, range);

console.log(minNum + maxNum);
