'use strict';

const fs = require('fs');

const rules = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean);

const bagRules = rules.reduce((bagRules, rule) => {
  const color = rule.match(/^(.+) bags contain/)[1];
  const holds = [...rule.matchAll(/\d (.+?) bag/g)].map(match => match[1]);

  bagRules[color] = holds;

  return bagRules;
}, {});

const processed = [];
const toProcess = [ 'shiny gold' ];
const validBags = {};

while (toProcess.length) {
  const bagToProcess = toProcess.pop();

  Object.keys(bagRules).forEach((bag) => {
    const smallerBags = bagRules[bag];

    if (smallerBags.includes(bagToProcess)) {
      validBags[bag] = true;

      if (!processed.includes(bag) && !toProcess.includes(bag)) {
        toProcess.push(bag);
      }
    }
  });

  processed.push(bagToProcess);
}

console.log(Object.keys(validBags).length);
