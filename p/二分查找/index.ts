/**
 *
 * @param source sorted array
 * @param n search number
 */
function findByLoop(source: number[], n: number) {
  let maxIndex = source.length;
  let minIndex = 0;

  let centerIndex: number;
  let centerNumber: number;

  while (true) {
    centerIndex = minIndex + Math.floor((maxIndex - minIndex) / 2);
    centerNumber = source[centerIndex];

    if (!centerNumber) return -1;

    if (n > centerNumber) {
      minIndex = centerIndex;
    } else if (n < centerNumber) {
      maxIndex = centerIndex;
    } else {
      return centerIndex;
    }
  }
}

console.log(findByLoop([1, 3, 5, 6, 12, 15, 20], 6));
