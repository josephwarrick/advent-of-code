'use strict';

const fs = require('fs');

const adaptors = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').map(Number).filter(Boolean).sort((a,b) => { return a - b; });
const numDescendentsMemory = {};

function countDescendentAdaptors(inputAdaptor) {
  if (numDescendentsMemory[inputAdaptor]) return numDescendentsMemory[inputAdaptor];

  const validChildAdaptors = adaptors.filter(adaptor => adaptor > inputAdaptor && adaptor <= inputAdaptor + 3);

  if (validChildAdaptors.length === 0) return 1;

  const childAdaptorDescendentCounts = validChildAdaptors.map(countDescendentAdaptors);
  const totalDescendentCount = childAdaptorDescendentCounts.reduce((sum, child) => { return sum + child; }, 0);
  numDescendentsMemory[inputAdaptor] = totalDescendentCount;

  return totalDescendentCount;
}

console.log(countDescendentAdaptors(0));
