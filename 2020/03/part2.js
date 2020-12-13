'use strict';

const fs = require('fs');

const grid = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean).map(row => row.split(''));
const slopes = [
  [ 1, 1 ],
  [ 3, 1 ],
  [ 5, 1 ],
  [ 7, 1 ],
  [ 1, 2 ]
];

function countTreeCollisions([deltaX, deltaY]) {
  let collisionCount = 0;
  let x = 0;

  for (let y = 0; y < grid.length; y += deltaY) {
    if (grid[y][x] === '#') collisionCount++;
    x = (x + deltaX) % grid[0].length;
  }

  return collisionCount;
}

const collisionCounts = slopes.map(countTreeCollisions);

console.log(collisionCounts.reduce((answer, count) => { return answer * count; }, 1));
