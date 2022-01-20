'use strict';

const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n\n');
const rawRules = input[0].split('\n').filter(Boolean);
const rawStrings = input[1].split('\n').filter(Boolean);
const stringsForRule = {};

while (Object.keys(stringsForRule).length  < rawRules.length) {
  rawRules.forEach((rawRule) => {
    const [ ruleNumber, rule ] = rawRule.split(': ');
    if (stringsForRule[ruleNumber]) return;
  
    if (/[a-z]/.test(rule)) {
      stringsForRule[ruleNumber] = [ rule.replace(/"/g, '') ];
    } else if (allChildRulesExist(rule) && / \| /.test(rule)) {
      const [ ruleOne, ruleTwo ] = rule.split(' | ');
      stringsForRule[ruleNumber] = combineRules.apply(null, ruleOne.split(' ')).concat(combineRules.apply(null, ruleTwo.split(' ')));
    } else if (allChildRulesExist(rule)) {
      stringsForRule[ruleNumber] = combineRules.apply(null, rule.split(' '));
    }
  }); 
} 

function allChildRulesExist(rule) {
  const parts = rule.split(' ');
  
  return parts.every((part) => {
    return Boolean(part === '|' || stringsForRule[part]);
  });
} 

function combineRules(ruleOne, ruleTwo) {
  return stringsForRule[ruleOne].reduce((combinedStrings, ruleOneString) => {
    return (stringsForRule[ruleTwo] || ['']).reduce((innerCombinedStrings, ruleTwoString) => {
      innerCombinedStrings.push(ruleOneString + ruleTwoString); 
      return innerCombinedStrings;
    }, combinedStrings);
  }, []);
} 

function stringIsValid(str, ruleNumber) {
  return stringsForRule[ruleNumber].some(stringForRule => stringForRule === str);
}

const validStrings = rawStrings.filter(str => stringIsValid(str, 0) );

console.log(validStrings.length);
