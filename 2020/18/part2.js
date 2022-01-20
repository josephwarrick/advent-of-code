'use strict';

const fs = require('fs');

const lines = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean);

function deParenthesize(str) {
  return str.replace(/\(([^()]+)\)/g, (match, capture) => doMath(capture));
}

function simpleAdd(str) {
  return str.replace(/(\d+) \+ (\d+)/g, (match, num1, num2) => { return Number(num1) + Number(num2) });
}

function simpleMult(str) {
  return str.replace(/(\d+) \* (\d+)/g, (match, num1, num2) => { return Number(num1) * Number(num2) });
}

function doMath(str) {
  while (Number(str).toString() !== str) {
    let lengthBefore = str.length;

    str = deParenthesize(str);
    if (str.length < lengthBefore) continue;

    str = simpleAdd(str);
    if (str.length < lengthBefore) continue;

    str = simpleMult(str);
  }

  return Number(str);
}

const results = lines.map(doMath);
const sumOfResults = results.reduce((sum, result) => { return sum + result }, 0);

console.log(sumOfResults);
