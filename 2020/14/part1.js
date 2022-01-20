'use strict';

const fs = require('fs');

const lines = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean);
const memory = {};
let mask;

function getAddress(line) {
  if (/^mem/.test(line) === false) return;
  return line.split(']').shift().split('[').pop();
}

function getValue(line) {
  return line.split(' = ').pop();
}

function getMask(line) {
  if (/^mask/.test(line) === false) return;
  return getValue(line);
}

function leftPad(binaryString) {
  const padded = new Array(36).fill('0').join('') + binaryString;
  return padded.slice(-36);
}

function maskValue(mask, value) {
  const maskParts = mask.split('');
  const valueParts = value.split('');

  return valueParts.map((valuePart, i) => {
    if (maskParts[i] === 'X') return valuePart;
    return maskParts[i];
  }).join('');
}

lines.forEach((line) => {
  mask = getMask(line) || mask;

  const memoryAddress = getAddress(line);
  const memoryValue = parseInt(getValue(line), 10);
  const memoryValueAsBinary = leftPad(memoryValue.toString(2));

  if (!memoryAddress) return;

  memory[memoryAddress] = parseInt(maskValue(mask, memoryValueAsBinary), 2);
});

const sumOfAllValues = Object.values(memory).reduce((sum, value) => {
  return sum + value;
}, 0);

console.log(sumOfAllValues);
