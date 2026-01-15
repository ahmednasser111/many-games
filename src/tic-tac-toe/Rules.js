export class Rules {
  static WIN_LINES = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
  ];

  static checkWin(board) {
    const flat = board.flat();

    for (const line of this.WIN_LINES) {
      const [a, b, c] = line;
      if (flat[a] && flat[a] === flat[b] && flat[a] === flat[c]) {
        return {
          winner: flat[a],
          line: line
        };
      }
    }

    return null;
  }

  static checkDraw(board) {
    return !this.checkWin(board) && board.flat().every(cell => cell !== null);
  }

  static isValidMove(board, row, col) {
    if (row < 0 || row > 2 || col < 0 || col > 2) {
      return false;
    }
    return board[row][col] === null;
  }

  static getValidMoves(board) {
    const moves = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === null) {
          moves.push({ row, col });
        }
      }
    }
    return moves;
  }

  static toCellIndex(row, col) {
    return row * 3 + col;
  }

  static fromCellIndex(index) {
    return {
      row: Math.floor(index / 3),
      col: index % 3
    };
  }
}
