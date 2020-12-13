'use strict';

const fs = require('fs');

const adaptors = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').map(Number).filter(Boolean).sort((a,b) => { return a - b; });

let nums = {
  '3': 1 // from adaptor to my device
};
let last = 0;

for (let i = 0; i < adaptors.length; i++) {
  const delta = adaptors[i] - last;
  nums[delta] = nums[delta] + 1 || 1;
  last = adaptors[i];
}

console.log(nums[1] * nums[3]);
