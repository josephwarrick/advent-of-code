'use strict';

const fs = require('fs');

const cups = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean)[0].split('').map(Number);

function CupLinkedListNode(value, nextNode) {
  this.value = value;
  this.nextNode = nextNode;
}

function buildCupLinkedList(cups) {
  const cupPointers = new Array(1e6 + 1);

  for (let i = cupPointers.length - 1; i > 0; i--) {
    cupPointers[i] = new CupLinkedListNode(i, cupPointers[i + 1]);
  }

  // account for our initial cup state
  for (let i = 0; i < cups.length; i++) {
    const cupAtPosition = cups[i];
    const cupAtNextPosition = cups[i + 1] || cups.length + 1;
    cupPointers[cupAtPosition].nextNode = cupPointers[cupAtNextPosition];
  }
  cupPointers[cupPointers.length - 1].nextNode = cupPointers[cups[0]];

  return cupPointers;
}

function doMove(cupLinkedList, selectedCupIndex) {
  const selectedCupValue = cupLinkedList[selectedCupIndex].value;

  // cut out 3 cups after current cup;
  const removedCups = cupLinkedList[selectedCupIndex].nextNode;
  const removedCupValues = [ removedCups.value, removedCups.nextNode.value, removedCups.nextNode.nextNode.value ];
  cupLinkedList[selectedCupIndex].nextNode = cupLinkedList[selectedCupIndex].nextNode.nextNode.nextNode.nextNode;

  // figure out next cup value
  const numCups = cupLinkedList.length;
  let destinationCupValue = (selectedCupValue + numCups) % numCups;
  do {
    destinationCupValue--;
    if (destinationCupValue === 0) destinationCupValue = cupLinkedList.length - 1;
  } while (removedCupValues.includes(destinationCupValue));

  // re-insert removed cups
  const oldNextCup = cupLinkedList[destinationCupValue].nextNode;
  cupLinkedList[destinationCupValue].nextNode = removedCups;
  removedCups.nextNode.nextNode.nextNode = oldNextCup;

  // return the next cup in the circle
  return cupLinkedList[selectedCupIndex].nextNode.value;
}

const cupCircle = buildCupLinkedList(cups);
let currentCupIndex = cups[0];
let turn = 1;

while (turn <= 1e7) {
  currentCupIndex = doMove(cupCircle, currentCupIndex);
  turn++;
}

const cupAfterOne = cupCircle[1].nextNode.value;
const cupAfterCupAfterOne = cupCircle[1].nextNode.nextNode.value;

console.log(cupAfterOne * cupAfterCupAfterOne);
