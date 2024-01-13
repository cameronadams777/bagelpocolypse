# TODO

## FEATURES

- [ ] Floors

  - [x] Randomly create a floor with a potential stair case
  - [ ] Set spawn point for player
  - [ ] Set NPC spawn points (there won't always be NPC)
  - [ ] Set Bagel spawn points

- [ ] Player

  - [x] - Movement
  - [x] - Collisions
  - [x] - Lives

- [ ] Bagels

  - [x] Reduce player lives on collisons
  - [ ] Is idle
  - [ ] Follows player when within radius
    - [ ] Once alert, continues to follow for X amount of time

- [ ] NPC

  - [ ] Wanders the floor (looking for a way out lol)
  - [ ] Can attract the attention of a bagel if its not alerted by player already
  - [ ] If touched, it turns into a new bagel

- [ ] Power Ups/Downs
  - [x] - Cream Cheese
  - [x] - Salmon (Lox)
  - [ ] - Butter

## BUGS

- [ ] Set Timeout on Power Ups not consistent when collecting mulitple power ups
- [x] When generating initial Bagel spawns, there is the possibilty that no bagels will be generated
- [ ] GameObjects don't always spawn in rooms
