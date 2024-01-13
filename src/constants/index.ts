export enum GameTags {
  PLAYER_TAG = "player",
  BAGEL_TAG = "bagel",
  SALMON_TAG = "salmon",
  CREAM_CHEESE_TAG = "cream_cheese",
  ROOM_TAG = "room",
  CAMERA_TAG = "camera"
}

export enum TileMapSprites {
  FLOOR = 0,
  CONCRETE = 1,
  STAIRS = 2,
  PLAYER = 3,
  BAGEL = 4
}

export const TILE_SIZE = 32;
export const MIN_ROOM_WIDTH = 10;
export const MIN_ROOM_HEIGHT = 10;
export const MAX_ROOM_WIDTH = 20;
export const MAX_ROOM_HEIGHT = 20;
export const MAX_ROOM_COUNT = 3;
export const MAX_ROOM_GEN_ATTEMPTS_COUNT = 10;

export const PLAYER_SPEED = 5;
