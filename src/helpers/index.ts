/**
* Returns a random number between min (inclusive) and max (exclusive)
*/
export function getRandomArbitrary(min: number, max: number) {
   return Math.ceil(Math.random() * (max - min) + min);
}
