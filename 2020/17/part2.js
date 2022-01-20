'use strict';

const fs = require('fs');

let grid = [ [ fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean).map(line => line.split('')) ] ];

function cloneEmpty(grid) {
  if (Array.isArray(grid[0])) {
    return grid.map(subDimension => cloneEmpty(subDimension));
  } else {
    return new Array(grid.length).fill('.');
  }
}

function grow(grid) {
  if (Array.isArray(grid[0])) {
    grid = grid.map(subgrid => grow(subgrid));
    grid.unshift(cloneEmpty(grid[0]));
    grid.push(cloneEmpty(grid[0]));
  } else {
    grid.unshift('.');
    grid.push('.');
  }

  return grid;
}

function countActiveNeighbors(grid, x, y, z, w) {
  let count = 0;

  for (let _x = x - 1; _x <= x + 1; _x++) {
    if (_x < 0) continue;
    if (_x >= grid.length) continue;

    for (let _y = y - 1; _y <= y + 1; _y++) {
      if (_y < 0) continue;
      if (_y >= grid[0].length) continue;

      for (let _z = z - 1; _z <= z + 1; _z++) {
        if (_z < 0) continue;
        if (_z >= grid[0][0].length) continue;

        for (let _w = w - 1; _w <= w + 1; _w++) {
          if (_w < 0) continue;
          if (_w >= grid[0][0][0].length) continue;
          if (_x === x && _y === y && _z === z && _w === w) continue;

          if (grid[_x][_y][_z][_w] === '#') count++;
        }
      }
    }
  }

  return count;
}

function countActive(grid) {
  if (Array.isArray(grid)) {
    return grid.reduce((count, subGrid) => {
      return count + countActive(subGrid);
    }, 0);
  } else if (grid === '#') {
    return 1;
  } else {
    return 0;
  }
}

function live(grid) {
  const newGrid = cloneEmpty(grid);

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      for (let z = 0; z < grid[0][0].length; z++) {
        for (let w = 0; w < grid[0][0][0].length; w++) {
          const isActive = grid[x][y][z][w] === '#';
          const activeNeighborCount = countActiveNeighbors(grid, x, y, z, w);

          if (isActive && (activeNeighborCount === 2 || activeNeighborCount === 3)) {
            newGrid[x][y][z][w] = '#';
          } else if (isActive === false && activeNeighborCount === 3) {
            newGrid[x][y][z][w] = '#';
          } else {
            newGrid[x][y][z][w] = '.';
          }
        }
      }
    }
  }

  return newGrid;
}

for (let turn = 1; turn <= 6; turn++) {
  grid = live(grow(grid));
}

console.log(countActive(grid));
