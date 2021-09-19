
export const MINE_STATUS = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked",
}

export function createMineboard(boardSize, numOfMines) {
    const board = [];
    const minePositions = getMinePositions(boardSize, numOfMines);

    for (let idx = 0; idx < boardSize; idx++) {
        const row = [];
        for (let idy = 0; idy < boardSize; idy++) {
            const element = document.createElement("div");
            element.dataset.status = MINE_STATUS.HIDDEN;
            const tile = {
                element,
                idx,
                idy,
                mine: minePositions.some(positionMatch.bind(null, { idx, idy })),
                get status() {
                    return this.element.dataset.status;
                },
                set status(value) {
                    this.element.dataset.status = value;
                },
            }
            row.push(tile);
        }
        board.push(row);
    }
    return board;
}

export function markTile(tile) {
    if (tile.status !== MINE_STATUS.HIDDEN && tile.status !== MINE_STATUS.MARKED) {
        return;
    }
    if (tile.status === MINE_STATUS.MARKED) {
        tile.status = MINE_STATUS.HIDDEN;
    }
    else {
        tile.status === MINE_STATUS.MARKED;
    }
}

export function revealTile(board, tile) {
    if (tile.status !== MINE_STATUS.HIDDEN) {
        return;
    }
    if (tile.mine) {
        tile.status = MINE_STATUS.MINE;
        return;
    }
    tile.status = MINE_STATUS.NUMBER;
    const adjacentTiles = nearbyTiles(board, tile);
    const mines = adjacentTiles.filter(t => t.mine);
    if (mines.length === 0) {
        adjacentTiles.forEach(revealTile.bind(null, board));
    }
    else {
        tile.element.textContent = mines.length;
    }
}

export function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            return (
                tile.status === MINE_STATUS.NUMBER || 
                (tile.mine &&
                    (tile.status === MINE_STATUS.HIDDEN ||
                        tile.status === MINE_STATUS.MARKED))
            )
        })
    })
}

export function checkLost(board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === MINE_STATUS.MINE;
        })
    })
}

function getMinePositions(boardSize, numOfMines) {
    const positions = [];
    while (positions.length < numOfMines) {
        const position = {
            idx: randomNumber(boardSize),
            idy: randomNumber(boardSize),
        }
        if (!positions.some(p => positionMatch(null, position))) {
            positions.push(position);
        }
    }
    return positions;
}

function positionMatch(a, b) {
    return a.idx === b.idx && a.idy === b.idy;
}

function randomNumber(size) {
    return Math.floor(Math.random() * size)
}

function nearbyTiles(board, tile) {
    const tiles = [];

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            const tile = board[x + xOffset]?.[y + yOffset];
            if (tile) {
                tiles.push(tile);
            }
        }
    }
    return tiles;
}