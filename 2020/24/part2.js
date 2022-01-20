'use strict';

const fs = require('fs');

const instructions = fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean);

function findTile(instruction) {
  let coordinates = [0, 0];

  while (instruction.length) {
    let step;

    if (/^(e|w)/.test(instruction)) {
      step = instruction.slice(0, 1);
      instruction = instruction.slice(1);
    } else {
      step = instruction.slice(0, 2);
      instruction = instruction.slice(2);
    }

    if (step === 'e') {
      coordinates[1] += 1;
    } else if (step === 'se') {
      if (Math.abs(coordinates[0]) % 2 === 1) coordinates[1] += 1;
      coordinates[0] -= 1;
    } else if (step === 'sw') {
      if (Math.abs(coordinates[0]) % 2 === 0) coordinates[1] -= 1;
      coordinates[0] -=1;
    } else if (step === 'w') {
      coordinates[1] -= 1;
    } else if (step === 'nw') {
      if (Math.abs(coordinates[0]) % 2 === 0) coordinates[1] -= 1;
      coordinates[0] += 1; 
    } else if (step === 'ne') {
      if (Math.abs(coordinates[0]) % 2 === 1) coordinates[1] += 1;
      coordinates[0] += 1;
    }
  }

  return coordinates;
}

function buildInitialGrid(tiles) {
  const coordinates = Object.keys(tiles).filter(key => tiles[key] === 'black').map(key => key.split('|').map(Number));

  const minRow = Math.min.apply(Math, coordinates.map(c => c[0]));
  const maxRow = Math.max.apply(Math, coordinates.map(c => c[0]));
  const minCol = Math.min.apply(Math, coordinates.map(c => c[1]));
  const maxCol = Math.max.apply(Math, coordinates.map(c => c[1]));

  const grid = new Array(maxRow - minRow + 1).fill('_').map(_ => new Array(maxCol - minCol + 1).fill('white'));

  coordinates.forEach((coordinate) => {
    grid[coordinate[0] + Math.abs(minRow)][coordinate[1] + Math.abs(minCol)] = 'black';
  });

  if (Math.abs(minRow) % 2 === 1) grid.unshift(cloneEmpty(grid[0])); // ensure 0,0 is on an even row

  return grid;
}

function cloneEmpty(grid) {
  if (Array.isArray(grid[0])) {
    return grid.map(subGrid => cloneEmpty(subGrid));
  } else {
    return grid.map(_ => 'white');
  }
}

function grow(grid) {
  const wider = grid.map(row => ['white', 'white'].concat(row).concat(['white', 'white']));
  return [ cloneEmpty(wider[0]), cloneEmpty(wider[0])].concat(wider).concat([ cloneEmpty(wider[0]), cloneEmpty(wider[0]) ]);
}

function countBlackTiles(grid) {
  return grid.reduce((count, row) => {
    return count + row.reduce((rowCount, tile) => {
      return tile === 'black' ? rowCount + 1 : rowCount;
    }, 0);
  }, 0);
}

function countBlackNeighbors(grid, row, col) {
  let neighbors;

  if (row % 2 === 0) {
    neighbors = [
      grid[row][col + 1], //east
      grid[row + 1] && grid[row + 1][col], //south east
      grid[row + 1] && grid[row + 1][col - 1], //south west
      grid[row][col - 1], //west
      grid[row - 1] && grid[row - 1][col - 1], //north west
      grid[row - 1] && grid[row - 1][col] //north east
    ];
  } else {
    neighbors = [
      grid[row][col + 1], //east
      grid[row + 1] && grid[row + 1][col + 1], //south east
      grid[row + 1] && grid[row + 1][col], //south west
      grid[row][col - 1], //west
      grid[row - 1] && grid[row - 1][col], //north west
      grid[row - 1] && grid[row - 1][col + 1] //north east
    ];
  }

  return neighbors.filter(neighbor => neighbor === 'black').length;
}

const initialTiles = instructions.reduce((initialTiles, instruction) => {
  const tile = findTile(instruction).join('|');
  initialTiles[tile] = initialTiles[tile] === 'black' ? 'white' : 'black';
  return initialTiles;
}, {});

let grid = buildInitialGrid(initialTiles);
let day = 1;

while (day <= 100) {
  if (day % 2 === 1) grid = grow(grid);

  const newGrid = cloneEmpty(grid);

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const blackNeighborCount = countBlackNeighbors(grid, row, col);
      if (grid[row][col] === 'black' && (blackNeighborCount === 1 || blackNeighborCount === 2)) {
        newGrid[row][col] = 'black';
      } else if (grid[row][col] === 'white' && blackNeighborCount === 2) {
        newGrid[row][col] = 'black';
      }
    }
  }

  grid = newGrid;
  day++;
}

console.log(countBlackTiles(grid));
