export function createMatrix(grid, numArr) {
  let arrayOfArrays = [];
  // Split the original array into subarrays of length 'grid'
  for (let i = 0; i < numArr.length; i += grid) {
    let subArray = numArr.slice(i, i + grid);
    arrayOfArrays.push(subArray);
  }
  return arrayOfArrays;
}

const getSum = (arr) =>
  arr.flat(Infinity).reduce((acc, el) => {
    if (el > 0) {
      return acc + el;
    }
    return acc;
  }, 0);

export const getWinScore = (lastNum, arr) => lastNum * getSum(arr);

export const isCollumFilled = (board) => {
  let res = [];
  for (let i = 0; i < board.length; i++) {
    res.push(board.every((arr) => arr[i] === -1));
  }
  return res.some((arr) => arr);
};
