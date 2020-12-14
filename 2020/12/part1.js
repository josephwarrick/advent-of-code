'use strict';

const fs = require('fs');

const instructions = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean)
const position = [0,0];
let rotation = 0;

let actions = {
  N: (num) => {
    position[1] += num;
  },
  S: (num) => {
    position[1] -= num;
  },
  E: (num) => {
    position[0] += num;
  },
  W: (num) => {
    position[0] -= num;
  },
  L: (num) => {
    rotation -= num;
  },
  R: (num) => {
    rotation += num;
  },
  F: (num) => {
    actions[getDirection(rotation)](num)
  },
}

function getDirection(rotation) {
  const _rotation = ((rotation % 360) + 360) % 360;

  return {
    '0': 'E',
    '90': 'S',
    '180': 'W',
    '270': 'N'
  }[_rotation];
}

instructions.forEach((instruction, i) => {
  const action = instruction[0];
  const value = Number(instruction.split('').slice(1).join(''));
  actions[action](value);
});

console.log(Math.abs(position[0]) + Math.abs(position[1]));
