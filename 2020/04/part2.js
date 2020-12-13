'use strict';

const fs = require('fs');

const passports = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n\n').filter(Boolean);

const validPassports = passports.filter((passport) => {
  const byr = passport.match(/byr:([12]\d+)/);
  const iyr = passport.match(/iyr:([12]\d+)/);
  const eyr = passport.match(/eyr:([12]\d+)/);
  const hgt = passport.match(/hgt:(\d+)(cm|in)/);
  const hcl = passport.match(/hcl:#[0-9a-f]{6}/);
  const ecl = passport.match(/ecl:(amb|blu|brn|gry|grn|hzl|oth)/);
  const pid = passport.match(/pid:(\d+)/)

  return Boolean(
    byr && Number(byr[1]) >= 1920 && Number(byr[1]) <= 2002 &&
    iyr && Number(iyr[1]) >= 2010 && Number(iyr[1]) <= 2020 &&
    eyr && Number(eyr[1]) >= 2020 && Number(eyr[1]) <= 2030 &&
    hgt && (
      Boolean(hgt[2] === 'cm' && Number(hgt[1]) >= 150 && Number(hgt[1]) <= 193)
      ||
      Boolean(hgt[2] === 'in' && Number(hgt[1]) >= 59 && Number(hgt[1]) <= 76)
    ) &&
    hcl &&
    ecl &&
    pid && pid[1].length === 9
  );
});

console.log(validPassports.length);
