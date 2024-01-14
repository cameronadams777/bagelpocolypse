# TODO

## FEATURES

### GamePlay

- [ ] Floors

  - [x] Randomly create a floor with a potential stair case
  - [x] Wall creation
  - [x] Set spawn point for player
  - [ ] Set NPC spawn points (there won't always be NPC)
  - [x] Set Bagel spawn points
  - [ ] Don't allow GameObjects to leave rooms/corridors (wall collisions)
  - [ ] Spawn desks and other obstacles into rooms

- [x] Player

  - [x] - Movement
  - [x] - Collisions
  - [x] - Lives

- [ ] Camera

  - [x] - Displays only part of what is rendered
  - [x] - Follow player
  - [ ] - Doesn't exceed map bounds

- [ ] Bagels

  - [x] Reduce player lives on collisons
  - [x] Is idle
  - [x] Follows player when within radius
    - [ ] Once alert, continues to follow for X amount of time

- [ ] NPC

  - [ ] Wanders the floor (looking for a way out lol)
  - [ ] Can attract the attention of a bagel if its not alerted by player already
  - [ ] If touched, it turns into a new bagel

- [ ] Power Ups/Downs
  - [x] - Cream Cheese
  - [x] - Salmon (Lox)
  - [ ] - Butter

### Assets (Artwork)

- [ ] Player
- [ ] Bagels
  - [ ] Normal Bagel
  - [ ] Everything Bagel
- [ ] Cream Cheese
- [ ] Lox (Salmon)
- [ ] Game World
  - [x] Black outside room texture
  - [ ] Room floor
  - [ ] Room wall (Nice to have...)
  - [ ] Obstacles
    - [ ] Desk

## BUGS

- [ ] Set Timeout on Power Ups not consistent when collecting mulitple power ups
- [x] When generating initial Bagel spawns, there is the possibilty that no bagels will be generated
- [x] GameObjects don't always spawn in rooms
