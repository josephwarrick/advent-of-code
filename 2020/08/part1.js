'use strict';

const fs = require('fs');

const instructions = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean);
const completedInstructions = {};
let accumulator = 0;
let index = 0;

const operations = {
  acc: function acc(val) {
    accumulator += val;
    index++;
  },
  jmp: function jmp(val) {
    index += val;
  },
  nop: function nop(val) {
    index++;
  }
};

(function loop() {
  if (completedInstructions[index]) {
    console.log(accumulator);
    process.exit(0);
  }

  const [operation, value] = instructions[index].split(' ');
  completedInstructions[index] = true;
  operations[operation](Number(value));

  loop();
})();
