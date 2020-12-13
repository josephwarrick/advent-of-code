'use strict';

const fs = require('fs');

const passes = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean);

const seatNumbers = passes.map((pass) => {
  const row = parseInt(pass.slice(0,7).replace(/F/g, '0').replace(/B/g, '1'), 2);
  const col = parseInt(pass.slice(-3).replace(/L/g, '0').replace(/R/g, '1'), 2);

  return row * 8 + col;
});

for (let i = Math.min.apply(Math, seatNumbers); i < seatNumbers.length; i++) {
  if (seatNumbers.includes(i) === false) {
    console.log(i);
    process.exit(0);
  }
}

