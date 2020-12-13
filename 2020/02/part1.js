'use strict';

const fs = require('fs');

const rows = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean);

const validPasswords = rows.filter((row) => {
  const [ counts, letterRule, password ] = row.split(' ');
  const [ min, max ] = counts.split('-');
  const requiredLetter = letterRule.replace(/:/g, '');

  const letterCount = password.split('').filter(letter => letter === requiredLetter).length;

  return Boolean(letterCount >= min && letterCount <= max);
});

console.log(validPasswords.length);
