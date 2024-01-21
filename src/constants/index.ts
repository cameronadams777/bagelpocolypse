export enum GameTags {
  PLAYER_TAG = "player",
  BAGEL_TAG = "bagel",
  SALMON_TAG = "salmon",
  CREAM_CHEESE_TAG = "cream_cheese",
  ROOM_TAG = "room",
  CAMERA_TAG = "camera",
  SPREADING_TOOL_TAG = "spreading_tool",
  WIZARD_BOSS = "wizard_boss",
  BAGEL_MAGIC = "bagel_magic",
  FIREBALL = "fireball",
  TOASTER_GUN = "toaster_gun"
}

export enum TileMapSprites {
  FLOOR = 0,
  CONCRETE = 1,
  STAIRS = 2,
  PLAYER = 3,
  BAGEL = 4
}

export enum LevelType {
  DUNGEON_LEVEL = "dungeon_level",
  BOSS_LEVEL = "boss_level"
}

export const TILE_SIZE = 32;

export const MIN_ROOM_WIDTH = 10;
export const MIN_ROOM_HEIGHT = 10;
export const MAX_ROOM_WIDTH = 20;
export const MAX_ROOM_HEIGHT = 20;
export const MAX_ROOM_COUNT = 10;
export const MAX_ROOM_GEN_ATTEMPTS_COUNT = 10;
export const MAP_CONSTANTS = [5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export const PLAYER_SPEED = 0.05;
export const MAX_TOASTER_GUN_SHOT_COUNT = 15;
export const MAX_PLAYER_SPEED = 5;
export const MAX_SPREADING_TOOL_COUNT = 3;

export const BAGEL_SPEED = 3;
export const MAX_BAGEL_COUNT = 10;
