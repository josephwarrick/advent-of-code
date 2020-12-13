'use strict';

const fs = require('fs');

const grid = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean).map(row => row.split(''));
let treeCount = 0;
let x = 0;

for (let y = 0; y < grid.length; y++) {
  if (grid[y][x] === '#') treeCount++;
  x = (x + 3) % grid[0].length;
}

console.log(treeCount);
