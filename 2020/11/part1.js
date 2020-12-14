'use strict';

const crypto = require('crypto');
const fs = require('fs');

let seats = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean).map(v => v.split(''));
const maxX = seats[0].length;
const states = {};
let loop = true;

while (loop) {
  seats = seats.map((row, i, _seats) => {
    return row.map((seat, j, _row) => {
      if (seat === '.') return seat;

      const above = _seats[i - 1] && _seats[i - 1].slice(Math.max(j - 1, 0), Math.min(j + 2, maxX)) || [];
      const below = _seats[i + 1] && _seats[i + 1].slice(Math.max(j - 1, 0), Math.min(j + 2, maxX)) || [];
      const left = _seats[i][j - 1];
      const right = _seats[i][j + 1];

      if (seat === 'L') {
        return maybeFillSeat(above, left, right, below);
      }

      if (seat === '#') {
        return maybeEmptySeat(above, left, right, below);
      }
    });
  });

  const hash = hashSeats(seats);

  states[hash] = states[hash] + 1 || 1;
  if (states[hash] > 1) loop = false;
}

function maybeFillSeat(above, left, right, below) {
  const shouldFillSeat = [].concat(above).concat(left).concat(right).concat(below).every((seat) => {
    if (seat === '#') return false;
    return true;
  });

  return shouldFillSeat ? '#' : 'L';
}

function maybeEmptySeat(above, left, right, below) {
  const neighborCount = [].concat(above).concat(left).concat(right).concat(below).reduce((count, seat) => {
    if (seat === '#') return count + 1;
    return count;
  }, 0);

  return (neighborCount >= 4) ? 'L' : '#';
}

function hashSeats(seats) {
  const str = seats.map(row => row.join('')).join('');
  const hash = crypto.createHash('sha1');
  hash.update(str);
  return hash.digest('hex');
}

const fullSeatCount = seats.reduce((full, row) => {
  return full + row.reduce((_full, seat) => {
    return _full + ( seat === '#' && 1 || 0 );
  }, 0);
}, 0);

console.log(fullSeatCount);
