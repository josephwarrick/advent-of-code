'use strict';

const fs = require('fs');

const lines = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean)
const arrival = parseInt(lines[0], 10);
const busIds = lines[1].split(',').map(busId => parseInt(busId, 10)).filter(Boolean);

for (let minute = arrival; minute < Number.MAX_SAFE_INTEGER; minute++) {
  const departingBusses = busIds.filter(busId => minute % busId === 0);

  if (departingBusses.length) {
    console.log((minute - arrival) * departingBusses[0]);
    process.exit(0)
  }
}
