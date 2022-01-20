'use strict';

const fs = require('fs');

let grid = [ fs.readFileSync(`${__dirname}/input.txt`, 'utf8').split('\n').filter(Boolean).map(line => line.split('')) ];

function cloneEmpty(grid) {
  if (Array.isArray(grid[0])) {
    return grid.map(subDimension => cloneEmpty(subDimension));
  } else {
    return new Array(grid.length).fill('.');
  }
}

function grow(grid) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      grid[x][y].unshift('.');
      grid[x][y].push('.');
    }
  }

  for (let x = 0; x < grid.length; x++) {
    grid[x].unshift(cloneEmpty(grid[x][0]));
    grid[x].push(cloneEmpty(grid[x][0]));
  }

  grid.unshift(cloneEmpty(grid[0]));
  grid.push(cloneEmpty(grid[0]));

  return grid;
}

function countActiveNeighbors(grid, x, y, z) {
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
        if (_x === x && _y === y && _z === z) continue;

        if (grid[_x][_y][_z] === '#') count++;
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
        const isActive = grid[x][y][z] === '#';
        const activeNeighborCount = countActiveNeighbors(grid, x, y, z);

        if (isActive && (activeNeighborCount === 2 || activeNeighborCount === 3)) {
          newGrid[x][y][z] = '#';
        } else if (isActive === false && activeNeighborCount === 3) {
          newGrid[x][y][z] = '#';
        } else {
          newGrid[x][y][z] = '.';
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
