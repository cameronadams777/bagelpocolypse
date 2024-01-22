# TODO

## BUGS

- [ ] Set Timeout on Power Ups not consistent when collecting mulitple power ups
- [x] When generating initial Bagel spawns, there is the possibilty that no bagels will be generated
- [x] GameObjects don't always spawn in rooms
- [x] GameObjects sometimes spawn in walls
- [x] Moving in the y direction allows player to exit map through corners

## FEATURES

### GamePlay

- [ ] Floors

  - [x] Randomly create a floor with a potential stair case
  - [x] Wall creation
  - [x] Set spawn point for player
  - [ ] Set NPC spawn points (there won't always be NPC)
  - [x] Set Bagel spawn points
  - [x] Don't allow GameObjects to leave rooms/corridors (wall collisions)
  - [ ] Spawn desks and other obstacles into rooms

- [x] Player

  - [x] - Movement
  - [x] - Collisions
  - [x] - Lives

- [x] Camera

  - [x] - Displays only part of what is rendered
  - [x] - Follow player
  - [x] - Doesn't exceed map bounds

- [ ] Bagels

  - [x] Reduce player lives on collisons
  - [x] Is idle
  - [x] Follows player when within radius
    - [x] Once alert, continues to follow for X amount of time

- [ ] NPC

  - [ ] Wanders the floor (looking for a way out lol)
  - [ ] Can attract the attention of a bagel if its not alerted by player already
  - [ ] If touched, it turns into a new bagel

- [ ] Power Ups/Downs
  - [x] - Cream Cheese
  - [x] - Salmon (Lox)
  - [ ] - Butter

### Assets (Artwork)

- [x] Player
- [x] Bagels
  - [ ] Normal Bagel
  - [ ] Everything Bagel
- [ ] Cream Cheese
- [x] Lox (Salmon)
- [ ] Game World
  - [x] Black outside room texture
  - [x] Room floor
  - [x] Room wall (Nice to have...)
  - [ ] Obstacles
    - [ ] Desk
