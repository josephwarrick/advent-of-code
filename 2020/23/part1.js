'use strict';

const fs = require('fs');

let cups = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean)[0].split('').map(Number);
const numCups = cups.length;

function doMove(cups) {
  const currentCup = cups[0];
  const nextCups = cups.slice(1, 4);
  const remainingCups = cups.filter(cup => nextCups.includes(cup) === false);

  let destinationCup = ((currentCup - 1) + numCups) % numCups;
  if (destinationCup === 0) destinationCup = numCups;
  while (nextCups.includes(destinationCup)) {
    destinationCup = ((destinationCup - 1) + numCups) % numCups;
    if (destinationCup === 0) destinationCup = numCups;
  }
  const destinationCupIndex = remainingCups.indexOf(destinationCup);

  return remainingCups.slice(0, destinationCupIndex + 1).concat(nextCups).concat(remainingCups.slice(destinationCupIndex + 1));
}

function rotateCups(cups) {
  const first = cups[0];
  return cups.slice(1).concat(first);
}

for (let turn = 1; turn <= 100; turn++) {
  cups = doMove(cups);
  cups = rotateCups(cups);
}

while (cups[0] !== 1) {
  cups = rotateCups(cups);
}

console.log(cups.slice(1).join(''));
