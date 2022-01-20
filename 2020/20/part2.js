'use strict';

const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');
const tiles = input.split('\n\n').filter(Boolean).map((rawTileString) => {
  const lines = rawTileString.split('\n');

  return {
    tileNumber: /\d+/.exec(lines[0])[0],
    data: lines.slice(1).map(line => line.split(''))
  };  
}).reduce((tilesByNumber, tile) => {
  tilesByNumber[tile.tileNumber] = tile;
  return tilesByNumber;
}, {});
const gridSize = Math.sqrt(Object.keys(tiles).length);

function flipTile(tile) {
  tile.data = tile.data.map(row => row.reverse());
};

function rotateTile(tile, times) {
  let rotated = tile.data.map(row => row.map(col => col));

  while (times > 0) {
    let thisRotation = new Array(tile.data.length).fill('.').map(_ => new Array());

    for (let sourceColumn = 0; sourceColumn < tile.data[0].length; sourceColumn++) {
      for (let sourceRow = tile.data.length - 1; sourceRow >= 0; sourceRow--) {
        let rotatedRow = sourceColumn;
        thisRotation[rotatedRow].push(rotated[sourceRow][sourceColumn]);
      }
    }

    rotated = thisRotation;
    times--;
  }

  tile.data = rotated;
}

function trimEdges(tile) {
  tile.data = tile.data.map(row => row.slice(1, -1)).slice(1, -1);
}

function getTileEdges(tile) {
  return {
    top: tile.data[0].join(''),
    bottom: tile.data[tile.data.length - 1].join(''),
    left: tile.data.map(row => row[0]).join(''),
    right: tile.data.map(row => row[row.length - 1]).join('')
  };
}

const edgeToTileMap = Object.values(tiles).reduce((map, tile) => {
  const edges = getTileEdges(tile);

  [ edges.top, edges.bottom, edges.left, edges.right ].forEach((edge) => {
    const edgeBackwards = edge.split('').reverse().join('');
    map[edge] = map[edge] || [];
    map[edge].push(tile);
    map[edgeBackwards] = map[edgeBackwards] || [];
    map[edgeBackwards].push(tile);
  });

  return map;
}, {});

function orientTopLeftTile(tile) {
  const edges = getTileEdges(tile);

  const topEdgeCount = edgeToTileMap[edges.top].length;
  if (topEdgeCount !== 1) rotateTile(tile, 2);

  const leftEdgeCount = edgeToTileMap[edges.left].length;
  if (topEdgeCount !== 1) flipTile(tile);
}

function orientTile(tile, targetEdge, targetSide) {
  let edges = getTileEdges(tile);
  let rotations = 0;

  while (edges[targetSide] !== targetEdge) {
    if (rotations >= 4) {
      flipTile(tile);
      rotations = 0;
    }
    rotateTile(tile, 1);
    rotations++;
    edges = getTileEdges(tile);
  }
}

function findMatchingTile(tile, side) {
  const oppositeSide = {
    right: 'left',
    bottom: 'top'
  };

  const edge = getTileEdges(tile)[side];
  const tilesWithEdge = edgeToTileMap[edge];
  const matchingTile = tilesWithEdge.filter(possibleMatch => possibleMatch.tileNumber !== tile.tileNumber)[0];
  orientTile(matchingTile, edge, oppositeSide[side]);
  return matchingTile;
}

function arrangeAllTiles() {
  const tileGrid = new Array(gridSize).fill('.').map(_ => new Array(gridSize));

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (row === 0) {
        if (col === 0) {
          tileGrid[0][0] = tiles[cornerTiles[0]];
        } else {
          const previousTile = tileGrid[row][col - 1];
          tileGrid[row][col] = findMatchingTile(previousTile, 'right');
        }
      } else {
        const previousTile = tileGrid[row - 1][col];
        tileGrid[row][col] = findMatchingTile(previousTile, 'bottom');
      }
    }
  }

  return tileGrid;
}

function collapseGridToImage(tileGrid) {
  const finalImage = new Array();

  for (let row = 0; row < tileGrid.length; row++) {
    for (let col = 0; col < tileGrid[0].length; col++) {
      for (let tileRow = 0; tileRow < tileGrid[0][0].data.length; tileRow++) {
        let cumulativeRow = (row * tileGrid[0][0].data.length) + tileRow;
        if (col === 0) finalImage[cumulativeRow] = [];
        finalImage[cumulativeRow] = finalImage[cumulativeRow].concat(tileGrid[row][col].data[tileRow]);
      }
    }
  }

  return finalImage;
}

function getMonster() {
  return [
    '                  # ',
    '#    ##    ##    ###',
    ' #  #  #  #  #  #   '
  ];
}

function getMonsterRegex(rowOfMonster) {
  return new RegExp(getMonster()[rowOfMonster].replace(/ /g, '.'), 'g');
}

function getMonsterZone(imageData, row, col) {
  const monsterLength = getMonster()[0].length;

  return {
    head: imageData[row].slice(col, col + monsterLength),
    torso: imageData[row + 1].slice(col, col + monsterLength),
    feet: imageData[row + 2].slice(col, col + monsterLength)
  };
}

function markMonster(imageData, row, col) {
  getMonster().forEach((monsterSlice, monsterRow) => {
    const monsterParts = monsterSlice.split('');
    monsterParts.forEach((monsterPart, monsterCol) => {
      if (monsterPart === '#') imageData[row + monsterRow][col + monsterCol] = 'O';
    });
  });
}

function findMonsters(imageData) {
  const monsterLength = getMonster()[0].length;

  for (let row = 1; row < imageData.length - 1; row++) {
    const monsterTorsoRegex = getMonsterRegex(1);
    let monsterTorsoMatch = monsterTorsoRegex.exec(imageData[row].join(''));

    while (monsterTorsoMatch) {
      const monsterZone = getMonsterZone(imageData, row - 1, monsterTorsoMatch.index);

      const monsterHeadMatch = getMonsterRegex(0).exec(monsterZone.head.join(''));
      const monsterFeetMatch = getMonsterRegex(2).exec(monsterZone.feet.join(''));

      if (monsterHeadMatch && monsterFeetMatch) {
        markMonster(imageData, row - 1, monsterTorsoMatch.index);
      }

      monsterTorsoMatch = monsterTorsoRegex.exec(imageData[row].join(''));
    }
  }
}

function getImageStats(image) {
  return image.reduce((stats, row) => {
    return row.reduce((stats, pixel) => {
      stats[pixel] = stats[pixel] + 1 || 1;
      return stats;
    }, stats);
  }, {});
}

const edgeTiles = Object.values(edgeToTileMap).filter(tilesForEdge => tilesForEdge.length === 1).map(tileSet => tileSet[0]);
const edgeTileCounts = edgeTiles.reduce((tileCounts, tile) => {
  tileCounts[tile.tileNumber] = tileCounts[tile.tileNumber] + 1 || 1;
  return tileCounts;
}, {});
const cornerTiles = Object.keys(edgeTileCounts).filter(tileNumber => edgeTileCounts[tileNumber] === 4);

orientTopLeftTile(tiles[cornerTiles[0]]);
const tileGrid = arrangeAllTiles();
tileGrid.forEach(row => row.forEach(trimEdges));
const finalImage = collapseGridToImage(tileGrid);

const imageAsTile = { data: finalImage }
let rotations = 0;

while (getImageStats(imageAsTile.data).O === undefined) {
  if (rotations >= 4) {
    flipTile(imageAsTile);
    rotations = 0;
  }
  findMonsters(imageAsTile.data);
  rotateTile(imageAsTile, 1);
  rotations++;
}

console.log(getImageStats(imageAsTile.data)['#']);
