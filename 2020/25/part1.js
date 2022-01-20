'use strict';

const fs = require('fs');

const publicKeys = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').map(Number).filter(Boolean);
const MAGIC_PRIME = 20201227;

function transform(subjectNumber, loopSize) {
  let result = 1;

  while (loopSize) {
    result = (result * subjectNumber) % MAGIC_PRIME;
    loopSize--;
  }

  return result;
}

function guessLoopSize(subjectNumber, result) {
  let loopSize = 0;
  let currentValue = 1;

  while(currentValue !== result) {
    currentValue = (currentValue * subjectNumber) % MAGIC_PRIME;
    loopSize++;
  }

  return loopSize;
}

const cardLoopSize = guessLoopSize(7, publicKeys[0]);
const encryptionKey = transform(publicKeys[1], cardLoopSize);

console.log(encryptionKey);
