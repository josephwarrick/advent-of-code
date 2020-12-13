'use strict';

const fs = require('fs');

const rules = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean);

const bagRules = rules.reduce((bagRules, rule) => {
  const color = rule.match(/^(.+) bags contain/)[1];
  const holds = [...rule.matchAll(/(\d+) (.+?) bag/g)].reduce((obj, match) => { obj[match[2]] = Number(match[1]); return obj; }, {});

  bagRules[color] = holds;

  return bagRules;
}, {});

function getInnerCount(color) {
  if (!Object.keys(bagRules[color]).length) return 0;

  const rule = bagRules[color];
  
  const innerCount = Object.keys(rule).reduce((count, innerColor) => {
    return count + rule[innerColor] + getInnerCount(innerColor) * rule[innerColor];
  }, 0);
  
  return innerCount;
}

console.log(getInnerCount('shiny gold'));
