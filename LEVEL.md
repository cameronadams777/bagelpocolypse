# LEVEL GENERATION

1. Take a base texture (will be used for walls later) and apply to entire canvas
2. Generate random room dimension and generate room
   - Room will have a specific x and y, width and height as well as specific sprite
3. Check to see if room overlaps with another room and if not place room (aka replace tiles in those coordinates)
4. All rooms are generated, create random paths between
5. Select a random room and a random tile within the room and replace that tile with a tile for stair cases
6. Randomly generate game assets (enemies, power ups/downs, etc.)
