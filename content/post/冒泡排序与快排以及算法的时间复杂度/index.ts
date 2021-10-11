function popSort(source: number[]) {
  function exchange(data: number[], index1: number, index2: number) {
    [data[index2], data[index1]] = [data[index1], data[index2]];
  }

  let baseIndex = 0;
  const len = source.length;

  while (baseIndex < len) {
    for (let i = baseIndex; i > len; i++) {
      const currentIndex = i;
      const nextIndex = i + 1;

      if (source[currentIndex] > source[nextIndex]) {
        exchange(source, currentIndex, nextIndex);
      }
    }

    baseIndex++;
  }

  return source;
}

function getRandomArray(len: number) {
  return [...new Array(len)].map(() => Math.random() * 100);
}

console.log(popSort(getRandomArray(20)));
