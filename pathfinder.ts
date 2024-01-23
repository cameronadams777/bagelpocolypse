import Vector2 from "./src/game/math/vector2";
import { TILE_SIZE, MAP_CONSTANTS, TileMap } from "./src/constants";

onmessage = function (message) {
  const { position, nextPosition, map } = message.data;
  const path = getWalkingPath(position, nextPosition, map);
  postMessage(path);
};

const getWalkingPath = (start: Vector2, end: Vector2, map: TileMap[][]) => {
  const startPosition = new Vector2(Math.floor(start.x / TILE_SIZE), Math.floor(start.y / TILE_SIZE));
  const shortestPath = [];
  const visited = new Set<string>();
  traversePaths(startPosition, end, map, [], shortestPath, visited);
  return shortestPath;
};

const traversePaths = (
  start: Vector2,
  end: Vector2,
  map: TileMap[][],
  currentPath: Vector2[],
  shortestPath: Vector2[],
  visited: Set<string>
) => {
  if (start.toString() === end.toString()) {
    // Update Shortest Path
    if (shortestPath.length > 0) {
      if (currentPath.length < shortestPath.length) {
        shortestPath.pop();
        shortestPath = [...currentPath];
      }
    } else {
      shortestPath = [...currentPath];
    }
    return;
  }
  visited.add(start.toString());
  const validMoves = getValidMoves(start, map);
  for (let i = 0; i < validMoves.length; i++) {
    if (visited.has(validMoves[i].toString())) continue;
    currentPath.push(validMoves[i]);
    traversePaths(validMoves[i], end, map, currentPath, shortestPath, visited);
    currentPath.pop();
  }
  visited.delete(start.toString());
};

const getValidMoves = (position: Vector2, map: TileMap[][]) => {
  const left = new Vector2(position.x - 1, position.y);
  const right = new Vector2(position.x + 1, position.y);
  const up = new Vector2(position.x, position.y - 1);
  const down = new Vector2(position.x, position.y + 1);

  return [left, right, up, down].filter(
    (move) =>
      move.x >= 0 &&
      move.y >= 0 &&
      move.x <= map[0].length &&
      move.y <= map.length &&
      !MAP_CONSTANTS.includes(map[move.y][move.x])
  );
};
