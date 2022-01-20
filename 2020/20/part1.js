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

const edgeToTileMap = Object.values(tiles).reduce((map, tile) => {
  const tileEdgeTop = tile.data[0].join('');
  const tileEdgeBottom = tile.data[tile.data.length - 1].join('');
  const tileEdgeLeft = tile.data.map(row => row[0]).join('');
  const tileEdgeRight = tile.data.map(row => row[row.length - 1]).join('');

  [ tileEdgeTop, tileEdgeBottom, tileEdgeLeft, tileEdgeRight ].forEach((edge) => {
    const edgeBackwards = edge.split('').reverse().join('');
    map[edge] = map[edge] || [];
    map[edge].push(tile);
    map[edgeBackwards] = map[edgeBackwards] || [];
    map[edgeBackwards].push(tile);
  });

  return map;
}, {});

const edgeTiles = Object.values(edgeToTileMap).filter(tilesForEdge => tilesForEdge.length === 1).map(tileSet => tileSet[0]);

const edgeTileCounts = edgeTiles.reduce((tileCounts, tile) => {
  tileCounts[tile.tileNumber] = tileCounts[tile.tileNumber] + 1 || 1;
  return tileCounts;
}, {});

const cornerTiles = Object.keys(edgeTileCounts).filter(tileNumber => edgeTileCounts[tileNumber] === 4);

console.log(cornerTiles[0] * cornerTiles[1] * cornerTiles[2] * cornerTiles[3]);
