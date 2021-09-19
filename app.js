import { MINE_STATUS, createMineboard, markTile, revealTile, checkWin, checkLost } from "./minesweeper.js"

const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 10;

const board = createMineboard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector(".board");
const minesLeftText = document.querySelector('[data-mine-count]');
const messageText = document.querySelector(".subtext");

board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element)
        tile.element.addEventListener("click", () => {
            revealTile(board, tile);
            checkGameEnd();
        })
        tile.element.addEventListener("contextmenu", e => {
            e.preventDefault();
            markTile(tile);
            listMinesLeft();
        })
    })
})
boardElement.style.setProperty("--size", BOARD_SIZE);
minesLeftText.textContent = NUMBER_OF_MINES;

function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === MINE_STATUS.MARKED).length;
    }, 0);
    minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount;
}

function checkGameEnd(params) {
    const win = checkWin(board);
    const lost = checkLost(board);

    if (win || lost) {
        boardElement.addEventListener("click", stopProp, { capture: true });
        boardElement.addEventListener("contextmenu", stopProp, { capture: true })
    }
    if (win) {
        messageText.textContent = "YOU WIN";
    }
    if (lost) {
        messageText.textContent = "YOU LOST";
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === MINE_STATUS.MARKED) {
                    markTile(tile);
                }
                if (tile.mine) {
                    revealTile(board, tile);
                }
            })
        })
    }
}

function stopProp(e) {
    e.stopImmediatePropogation();
}