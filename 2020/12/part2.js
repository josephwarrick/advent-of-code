'use strict';

const fs = require('fs');

const instructions = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean)
const position = [0,0];
let waypoint = [10,1];

let actions = {
  N: (num) => {
    waypoint[1] += num;
  },
  S: (num) => {
    waypoint[1] -= num;
  },
  E: (num) => {
    waypoint[0] += num;
  },
  W: (num) => {
    waypoint[0] -= num;
  },
  L: (num) => {
    waypoint = [ waypoint[1] * -1, waypoint[0] ];
  },
  R: (num) => {
    waypoint = [ waypoint[1], waypoint[0] * -1 ];
  },
  F: (num) => {
    position[0] += (num * waypoint[0]);
    position[1] += (num * waypoint[1]);
  },
}

instructions.forEach((instruction, i) => {
  const action = instruction[0];
  const value = Number(instruction.split('').slice(1).join(''));

  if (['L','R'].includes(action)) {
    const times = value / 90;
    for (let i = 0; i < times; i++) {
      actions[action](value);
    }
  } else {
    actions[action](value);
  }
});

console.log(Math.abs(position[0]) + Math.abs(position[1]));
