function initConnect4(canvas, ongameend) {
    var board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ];

    drawBoard(canvas.getContext("2d"), board);

    let currColor = 1;

    const onclick = (event) => {
        const rowCount = board.length;
        const colCount = board[0].length;
        const width = canvas.width;
        const colWidth = width / colCount;

        let col = parseInt(event.clientX / colWidth);

        let row;
        for (row = 0; row < rowCount && board[row][col] == 0; row++);
        row--;

        if (row != -1) {
            board[row][col] = currColor;
            drawBoard(canvas.getContext("2d"), board);

            let winner = checkWinner(board);
            if (winner != 0) {
                canvas.removeEventListener("click", onclick);
                ongameend(winner);
            } else {
                let gameEnded = true;
                board.forEach((row) => {
                    if (row.includes(0)) {
                        gameEnded = false;
                    }
                });
                if (gameEnded) {
                    canvas.removeEventListener("click", onclick);
                    ongameend(0);
                }
            }

            currColor = currColor == 1 ? 2 : 1;
        }
    };
    canvas.addEventListener("click", onclick);
}

function checkWinner(board) {
    const toWin = 4;
    const rowCount = board.length;
    const colCount = board[0].length;

    for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < colCount; col++) {
            const playerToCheck = board[row][col];
            if (playerToCheck == 0) {
                continue;
            }

            let rowOk = true,
                colOk = true,
                diagonalOk = true,
                diagonal2Ok = true;

            for (let add = 1; add < toWin; add++) {
                // check row
                let rowCheckCol = col + add;
                if (rowCheckCol >= colCount || board[row][rowCheckCol] != playerToCheck) {
                    rowOk = false;
                }

                // check col
                let colCheckRow = row + add;
                if (colCheckRow >= rowCount || board[colCheckRow][col] != playerToCheck) {
                    colOk = false;
                }

                // diagonal check (top left to bottom right)
                if (rowCheckCol >= colCount || colCheckRow >= rowCount || board[colCheckRow][rowCheckCol] != playerToCheck) {
                    diagonalOk = false;
                }

                // diagonal check (top right to bottom left)
                let diagCheckCol = col - add;
                if (diagCheckCol < 0 || colCheckRow >= rowCount || board[colCheckRow][diagCheckCol] != playerToCheck) {
                    diagonal2Ok = false;
                }
            }

            if (rowOk || colOk || diagonalOk || diagonal2Ok) {
                return playerToCheck;
            }
        }
    }

    return 0;
}

function drawBoard(ctx, board) {
    const chipPadding = 5;
    const rowCount = board.length;
    const colCount = board[0].length;

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    const chipWidth = width / colCount;
    const chipHeight = height / rowCount;

    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, width, height);

    // draw chips
    for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < colCount; col++) {
            ctx.beginPath();
            ctx.fillStyle = board[row][col] == 1 ? "red" : board[row][col] == 2 ? "yellow" : "white";
            ctx.ellipse(
                chipWidth * col + chipWidth / 2, // x
                chipHeight * row + chipHeight / 2, // y
                chipWidth / 2 - chipPadding, // rx
                chipHeight / 2 - chipPadding, // ry
                0, // rotation
                0, // start angle
                2 * Math.PI // end angle
            );
            ctx.fill();
        }
    }
}
