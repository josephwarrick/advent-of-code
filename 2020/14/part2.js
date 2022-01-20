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
    if (maskParts[i] === '0') return valuePart;
    return maskParts[i];
  }).join('');
}

function writeValueToMemory(memoryAddress, value) {
  if (/X/.test(memoryAddress)) {
    writeValueToMemory(memoryAddress.replace('X', '0'), value);
    writeValueToMemory(memoryAddress.replace('X', '1'), value);
  } else {
    memory[memoryAddress] = value;
  }
}

lines.forEach((line) => {
  mask = getMask(line) || mask;

  const memoryAddress = parseInt(getAddress(line), 10);
  const memoryAddressAsBinary = leftPad(memoryAddress.toString(2));
  const memoryValue = parseInt(getValue(line), 10);

  if (!memoryAddress) return;

  writeValueToMemory(maskValue(mask, memoryAddressAsBinary), memoryValue);
});

const sumOfAllValues = Object.values(memory).reduce((sum, value) => {
  return sum + value;
}, 0);

console.log(sumOfAllValues);
