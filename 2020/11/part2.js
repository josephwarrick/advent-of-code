'use strict';

const crypto = require('crypto');
const fs = require('fs');

let seats = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean).map(v => v.split(''))
const states = {};
let loop = true;

while (loop) {
  const nextSeats = seats.map((row) => row.map(seat => '_'));

  for (var i = 0; i < seats.length; i++) {
    for (var j = 0; j < seats[0].length; j++) {
      if (seats[i][j] === '.') {
        nextSeats[i][j] = '.';
        continue;
      }

      const visibleSeats = [
        getSeat(seats, j, i, -1, -1),
        getSeat(seats, j, i, -1, 0),
        getSeat(seats, j, i, -1, 1),
        getSeat(seats, j, i, 0, -1),
        getSeat(seats, j, i, 0, 1),
        getSeat(seats, j, i, 1, -1),
        getSeat(seats, j, i, 1, 0),
        getSeat(seats, j, i, 1, 1),
      ];

      if (seats[i][j] === 'L') {
        nextSeats[i][j] = visibleSeats.every(seat => seat !== '#') ? '#' : 'L';
        continue;
      }

      if (seats[i][j] === '#') {
        nextSeats[i][j] = visibleSeats.filter(seat => seat === '#').length >= 5 ? 'L' : '#';
        continue;
      }
    }
  }

  const hash = hashSeats(nextSeats);

  states[hash] = states[hash] + 1 || 1;
  if (states[hash] > 1) loop = false;
  seats = nextSeats;
}

function getSeat(seats, x, y, deltaX, deltaY) {
  let searching = true;
  let seat;

  while (searching && x >= 0 && x < seats[0].length && y >= 0 && y < seats.length) {
    x += deltaX;
    y += deltaY;

    if (seats[y] && seats[y][x] !== '.') {
      seat = seats[y][x];
      searching = false;
    }
  }

  return seat;
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
