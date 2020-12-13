'use strict';

const fs = require('fs');

const passports = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n\n').filter(Boolean);

const validPassports = passports.filter((passport) => {
  return Boolean(
    /byr:./.test(passport) &&
    /iyr:./.test(passport) &&
    /eyr:./.test(passport) &&
    /hgt:./.test(passport) &&
    /hcl:./.test(passport) &&
    /ecl:./.test(passport) &&
    /pid:./.test(passport)
  );
});

console.log(validPassports.length);
