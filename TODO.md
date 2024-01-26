## BUGS

- [x] When generating initial Bagel spawns, there is the possibilty that no bagels will be generated
- [x] GameObjects don't always spawn in rooms
- [x] GameObjects sometimes spawn in walls
- [x] Moving in the y direction allows player to exit map through corners

## FEATURES

### GamePlay

- [x] Floors

  - [x] Randomly create a floor with a potential stair case
  - [x] Wall creation
  - [x] Set spawn point for player
  - [x] Set NPC spawn points (there won't always be NPC)
  - [x] Set Bagel spawn points
  - [x] Don't allow GameObjects to leave rooms/corridors (wall collisions)

- [x] Player

  - [x] - Movement
  - [x] - Collisions
  - [x] - Lives

- [x] Camera

  - [x] - Displays only part of what is rendered
  - [x] - Follow player
  - [x] - Doesn't exceed map bounds

- [x] Bagels

  - [x] Reduce player lives on collisons
  - [x] Is idle
  - [x] Follows player when within radius
    - [x] Once alert, continues to follow for X amount of time

- [x] NPC

  - [x] Wanders the floor (looking for a way out lol)
  - [x] Can attract the attention of a bagel if its not alerted by player already
  - [x] If touched, it turns into a new bagel

- [x] Power Ups/Downs
  - [x] - Cream Cheese
  - [x] - Salmon (Lox)

### Assets (Artwork)

- [x] Player
- [x] Bagels
- [x] Cream Cheese
- [x] Lox (Salmon)
- [x] Game World
  - [x] Black outside room texture
  - [x] Room floor
  - [x] Room wall (Nice to have...)
