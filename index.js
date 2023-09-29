import {
  allNumbersTest,
  allNumbersTask,
  drawNum,
  drawNumTask,
} from "./js/data.js";
import { createMatrix, getWinScore, isCollumFilled } from "./js/servise.js";
import { postData } from "./js/api.js";

const gridNum = 5;
const boards = createMatrix(gridNum, createMatrix(gridNum, allNumbersTest));
const boardsTask = createMatrix(gridNum, createMatrix(gridNum, allNumbersTask));

///////////////solution//////////

function getWinners(numArr, boardsArr) {
  return new Promise((resolve) => {
    let winners = [];

    for (let i = 0; i < numArr.length; i++) {
      boardsArr.map((board, index) => {
        // replace matched value with -1
        const updatedBoard = board.map((arr) =>
          arr.map((el) => (el === numArr[i] ? -1 : el))
        );
        boardsArr[index] = updatedBoard;

        // check and create winners objs
        const isWinnerCol = isCollumFilled(updatedBoard);
        const isWinnerRow = updatedBoard.some((arr) =>
          arr.every((el) => el === -1)
        );

        if (isWinnerRow || isWinnerCol) {
          winners.push({
            board: updatedBoard,
            lastNum: numArr[i],
            indexMain: index,
          });
        }
      });
    }
    resolve(winners);
  });
}

function getLastScore(winners) {
  const uniqueIndex = {};
  const winnersArr = winners.reduce((accumulator, item) => {
    //find first occurrences of indexMain
    const index = item.indexMain;
    if (!uniqueIndex.hasOwnProperty(index)) {
      uniqueIndex[index] = true;
      accumulator.push(item);
    }
    return accumulator;
  }, []);

  const board = winnersArr[winnersArr.length - 1].board;
  const lastNum = winnersArr[winnersArr.length - 1].lastNum;
  return getWinScore(lastNum, board);
}

getWinners(drawNum, boards)
  .then((winners) => getLastScore(winners))
  .catch((error) => console.error("Error:", error));

let RESULT;
async function result() {
  try {
    const winners = await getWinners(drawNumTask, boardsTask);
    const res = getLastScore(winners);
    RESULT = res;
    return RESULT;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function postResult() {
  await result();
  const h1 = document.querySelector("h1");
  h1.innerHTML = RESULT;

  const url = "https://customer-api.krea.se/coding-tests/api/squid-game";
  const data = {
    answer: RESULT,
    name: "Halyna Stepanenko",
  };
  await postData(url, data);
}

postResult();
