'use strict';

const fs = require('fs');

const lines = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean);

function splitToArray(str) {
  return str.split('').filter(v => Boolean(v.trim())).map(v => Number(v) || v);
}

function doMath(arr) {
  let result;
  let operand;

  for (let i = 0; i < arr.length; i++) {
    let thing = arr[i];

    if (thing === '+' || thing === '*') {
      operand = thing;
      continue;
    }

    if (thing === '(') {
      const subProblem = getSubProblem(arr.slice(i));
      thing = doMath(subProblem);
      i = i + subProblem.length + 1; // plus 1 for the closing parentheses
    }

    if (!result) {
      result = thing;
    } else if (operand === '*') {
      result = result * thing;
    } else if (operand === '+') {
      result = result + thing;
    }
  }

  return result;
}

function getSubProblem(arr) {
  let parensDeep = 0;
  let subProblem = [];
  let i = 0;

  while (i === 0 || parensDeep > 0) {
    if (arr[i] === '(') parensDeep++;
    if (arr[i] === ')') parensDeep--;
    subProblem.push(arr[i]);
    i++;
  }

  return subProblem.slice(1, -1); // slice to remove the outer parentheses
}

const results = lines.map(line => doMath(splitToArray(line)));

const sumOfResults = results.reduce((sum, result) => {
  return sum + result;
}, 0);

console.log(sumOfResults);
