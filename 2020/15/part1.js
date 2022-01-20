'use strict';

const fs = require('fs');

const startingNumbers = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n')[0].split(',').map(Number);
const lastSpokenAt = {};
let lastSpoken;
let turn = 1;

function speak(num) {
  lastSpokenAt[num] = lastSpokenAt[num] || [];
  lastSpokenAt[num].push(turn);
  lastSpokenAt[num] = lastSpokenAt[num].slice(-2);
  lastSpoken = num;
  turn++;
}

startingNumbers.forEach(speak);

while (turn <= 2020) {
  if (lastSpokenAt[lastSpoken].length === 1) {
    speak(0);
  } else {
    const turnDistance = lastSpokenAt[lastSpoken][1] - lastSpokenAt[lastSpoken][0];
    speak(turnDistance);
  }
}

console.log(lastSpoken);
