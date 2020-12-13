'use strict';

const fs = require('fs');

const instructions = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean);

let accumulator = 0;
let index = 0;
let lastModifiedIndex = -1;

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
  const completedInstructions = {};
  let instructionsAreModified = false;

  const modifiedInstructions = instructions.map((instruction, i) => {
    if (instructionsAreModified) return instruction;

    if (i > lastModifiedIndex && /^nop/.test(instruction)) {
      lastModifiedIndex = i;
      instructionsAreModified = true;
      return instruction.replace(/^nop/, 'jmp');
    } else if (i > lastModifiedIndex && /^jmp/.test(instruction)) {
      lastModifiedIndex = i;
      instructionsAreModified = true;
      return instruction.replace(/^jmp/, 'nop');
    }

    return instruction;
  });

  while (!completedInstructions[index]) {
    if (index === instructions.length) {
      console.log(accumulator);
      process.exit(0);
    }
  
    const [operation, value] = modifiedInstructions[index].split(' ');
    completedInstructions[index] = true;
    operations[operation](Number(value));
  }

  index = 0;
  accumulator = 0;

  loop();
})();
