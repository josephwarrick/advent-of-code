'use strict';

const fs = require('fs');

const instructions = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean);

function findTile(instruction) {
  let coordinates = [0, 0];

  while (instruction.length) {
    let step;

    if (/^(e|w)/.test(instruction)) {
      step = instruction.slice(0, 1);
      instruction = instruction.slice(1);
    } else {
      step = instruction.slice(0, 2);
      instruction = instruction.slice(2);
    }

    if (step === 'e') {
      coordinates[1] += 1;
    } else if (step === 'se') {
      if (Math.abs(coordinates[0]) % 2 === 1) coordinates[1] += 1;
      coordinates[0] -= 1;
    } else if (step === 'sw') {
      if (Math.abs(coordinates[0]) % 2 === 0) coordinates[1] -= 1;
      coordinates[0] -=1;
    } else if (step === 'w') {
      coordinates[1] -= 1;
    } else if (step === 'nw') {
      if (Math.abs(coordinates[0]) % 2 === 0) coordinates[1] -= 1;
      coordinates[0] += 1; 
    } else if (step === 'ne') {
      if (Math.abs(coordinates[0]) % 2 === 1) coordinates[1] += 1;
      coordinates[0] += 1;
    }
  }

  return coordinates;
}

const result = instructions.reduce((result, instruction) => {
  const tile = findTile(instruction).join('|');
  result[tile] = result[tile] === 'black' ? 'white' : 'black';
  return result;
}, {});

const numBlack = Object.values(result).filter(color => color === 'black').length;

console.log(numBlack);
