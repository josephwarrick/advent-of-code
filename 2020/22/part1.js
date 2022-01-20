'use strict';

const fs = require('fs');

const sections = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n\n').filter(Boolean);
let [ player1Cards, player2Cards ] = sections.map(section => section.split('\n').map(line => Number(line)).filter(Boolean));

function doRound(player1Card, player2Card) {
  if (player1Card > player2Card) {
    return [ [ player1Card, player2Card ], [] ];
  } else {
    return [ [], [ player2Card, player1Card ] ];
  }
}

function scoreHand(cards) {
  return cards.reduce((score, card, i) => {
    return score + card * (cards.length - i);
  }, 0);
}

while (player1Cards.length > 0 && player2Cards.length > 0) {
  const [ player1Result, player2Result ] = doRound(player1Cards.shift(), player2Cards.shift());
  player1Cards = player1Cards.concat(player1Result);
  player2Cards = player2Cards.concat(player2Result);
}

console.log(Math.max(scoreHand(player1Cards), scoreHand(player2Cards)));
