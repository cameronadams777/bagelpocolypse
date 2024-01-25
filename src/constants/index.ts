export enum GameTag {
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
  TOASTER_GUN = "toaster_gun",
  OFFICE_WORKER = "office_worker"
}

export enum TileMap {
  BLACK = 0,
  FLOOR = 1,
  STAIRS = 2,
  PLAYER = 3,
  BAGEL = 4,
  SALMON = 5,
  SPREADING_TOOL = 6,
  TOP_LEFT_WALL = 7,
  TOP_WALL = 8,
  TOP_RIGHT_WALL = 9,
  RIGHT_WALL = 10,
  BOTTOM_RIGHT_WALL = 11,
  BOTTOM_WALL = 12,
  BOTTOM_LEFT_WALL = 13,
  LEFT_WALL = 14,
  BOTTOM_RIGHT_WALL_INNER = 15,
  TOP_LEFT_WALL_INNER = 16,
  TOP_RIGHT_WALL_INNER = 17,
  BOTTOM_LEFT_WALL_INNER = 18,
  BOSS = 19,
  TOASTER_GUN = 20,
  CREAM_CHEESE = 21,
  OFFICE_WORKER = 22
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
export const MAX_OFFICE_WORKERS_PER_FLOOR = 5;
export const MAX_POWER_UPS_PER_FLOOR = 5;
export const MAP_CONSTANTS = [
  TileMap.BLACK,
  TileMap.TOP_LEFT_WALL_INNER,
  TileMap.TOP_WALL,
  TileMap.TOP_RIGHT_WALL,
  TileMap.RIGHT_WALL,
  TileMap.BOTTOM_RIGHT_WALL,
  TileMap.BOTTOM_WALL,
  TileMap.BOTTOM_LEFT_WALL,
  TileMap.LEFT_WALL,
  TileMap.BOTTOM_RIGHT_WALL_INNER,
  TileMap.TOP_LEFT_WALL_INNER,
  TileMap.TOP_RIGHT_WALL_INNER,
  TileMap.BOTTOM_LEFT_WALL_INNER
];

export const PLAYER_SPEED = 0.05;
export const MAX_TOASTER_GUN_SHOT_COUNT = 15;
export const MAX_PLAYER_SPEED = 5;
export const MAX_SPREADING_TOOL_COUNT = 3;

export const BAGEL_SPEED = 3;
export const MAX_BAGEL_COUNT = 10;

export const BOSS_RELOCATION_TIMER_CONST = 250;
