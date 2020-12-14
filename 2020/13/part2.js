'use strict';

const fs = require('fs');

const lines = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean);
const busIds = lines[1].split(',').map(busId => parseInt(busId, 10));

const busOffsetMap = busIds.reduce((busOffsetMap, busId, i) => {
  if (!busId) return busOffsetMap;
  busOffsetMap[busId] = i;
  return busOffsetMap;
}, {});

function getInterval(start, interval, busId) {
  for (let i = start; i < Number.MAX_SAFE_INTEGER; i+=interval) {
    for(let j = Math.floor((i - busId) / busId) * busId; j < Number.MAX_SAFE_INTEGER; j+=busId) {
      const offset = busOffsetMap[busId];
      if (j - offset === i) return { start: i, interval: interval * busId };
      if (j - offset > i) break;
    }
  }
}

const answer = busIds.filter(Number).sort((a,b) => { return a - b; }).reduce((answer, busId) => {
  if (!busId) return answer;
  return getInterval(answer.start, answer.interval, busId);
}, { start: 0, interval: 1 });

console.log(answer.start);
