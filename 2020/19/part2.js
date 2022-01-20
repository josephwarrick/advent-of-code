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

function leadsWithRuleString(str, stringsForRule) {
  const ruleStringLength = stringsForRule[0].length;
  const strStart = str.slice(0, ruleStringLength);
  return stringsForRule.includes(strStart);
}

function removeLeadingRuleString(str, stringsForRule) {
  const ruleStringLength = stringsForRule[0].length;
  return str.slice(ruleStringLength);
}

function stringIsValid(str) {
  // rule 0: 8 11
  // rule 8: 42 | 42 8
  // rule 11: 42 31 | 42 11 31
  // so str needs to lead with two or more rule 42s, followed by one or more rule 31s (but less than the number of rule 42s)
  let leading42Count = 0;
  let trailing31Count = 0;

  while(leadsWithRuleString(str, stringsForRule[42])) {
    str = removeLeadingRuleString(str, stringsForRule[42]);
    leading42Count++;
  }

  while(leadsWithRuleString(str, stringsForRule[31])) {
    str = removeLeadingRuleString(str, stringsForRule[31]);
    trailing31Count++;
  }

  return str.length === 0 && leading42Count >= 2 && trailing31Count >= 1 && trailing31Count < leading42Count;
}

const validStrings = rawStrings.filter(stringIsValid);

console.log(validStrings.length);
