'use strict';

const fs = require('fs');

const sections = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n\n').filter(Boolean);
let [ player1Cards, player2Cards ] = sections.map(section => section.split('\n').map(line => Number(line)).filter(Boolean));

function hashHands(player1Hand, player2Hand) {
  return player1Hand.join(',') + '|' + player2Hand.join(',');
}

function getWinner(player1Cards, player2Cards) {
  const decksThisGame = {};

  while (player1Cards.length > 0 && player2Cards.length > 0) {
    const stateHash = hashHands(player1Cards, player2Cards);
    if (decksThisGame[stateHash]) return 'player1';
    decksThisGame[stateHash] = true;

    const player1ActiveCard = player1Cards.shift();
    const player2ActiveCard = player2Cards.shift();
    let winner;

    if (player1ActiveCard > player1Cards.length || player2ActiveCard > player2Cards.length) {
      if (player1ActiveCard > player2ActiveCard) {
        winner = 'player1';
      } else {
        winner = 'player2';
      }
    } else {
      winner = getWinner(player1Cards.slice(0, player1ActiveCard), player2Cards.slice(0, player2ActiveCard));
    }

    if (winner === 'player1') {
      player1Cards.push(player1ActiveCard);
      player1Cards.push(player2ActiveCard);
    } else {
      player2Cards.push(player2ActiveCard);
      player2Cards.push(player1ActiveCard);
    }
  }

  if (player1Cards.length) {
    return 'player1';
  } else {
    return 'player2';
  }
}

function scoreHand(cards) {
  return cards.reduce((score, card, i) => {
    return score + card * (cards.length - i);
  }, 0);
}

getWinner(player1Cards, player2Cards);

console.log(Math.max(scoreHand(player1Cards), scoreHand(player2Cards)));
