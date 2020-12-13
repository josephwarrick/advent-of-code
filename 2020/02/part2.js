'use strict';

const fs = require('fs');

const rows = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean);

const validPasswords = rows.filter((row) => {
  const [ positions, letterRule, password ] = row.split(' ');
  const [ i, j ] = positions.split('-');
  const requiredLetter = letterRule.replace(/:/g, '');

  const letters = password.split('');

  return Boolean(
    letters[i - 1] === requiredLetter && letters[j - 1] !== requiredLetter
    ||
    letters[i - 1] !== requiredLetter && letters[j - 1] === requiredLetter
  );
});

console.log(validPasswords.length);
