import { Rules } from "./Rules.js";

export class GameState {
	constructor(mode, players) {
		this.mode = mode;
		this.players = players;
		this.reset();
	}

	get board() {
		return this._board;
	}

	get currentPlayer() {
		return this._currentPlayer;
	}

	get currentPlayerInfo() {
		return this.players[this._currentPlayer.toLowerCase()];
	}

	get isGameOver() {
		return this._gameOver;
	}

	get winner() {
		return this._winner;
	}

	get winLine() {
		return this._winLine;
	}

	get isDraw() {
		return this._isDraw;
	}

	get moveHistory() {
		return [...this._moveHistory];
	}

	makeMove(row, col) {
		if (!Rules.isValidMove(this._board, row, col) || this._gameOver) {
			return { valid: false, winner: null, draw: false };
		}

		this._board[row][col] = this._currentPlayer;
		this._moveHistory.push({
			player: this._currentPlayer,
			row,
			col,
			timestamp: Date.now(),
		});

		const winResult = Rules.checkWin(this._board);
		if (winResult) {
			this._gameOver = true;
			this._winner = winResult.winner;
			this._winLine = winResult.line;
			return { valid: true, winner: this._winner, draw: false };
		}

		if (Rules.checkDraw(this._board)) {
			this._gameOver = true;
			this._isDraw = true;
			return { valid: true, winner: null, draw: true };
		}

		// Switch turns
		this._switchTurn();

		return { valid: true, winner: null, draw: false };
	}

	undo() {
		if (this._moveHistory.length === 0 || this._gameOver) {
			return false;
		}

		const lastMove = this._moveHistory.pop();
		this._board[lastMove.row][lastMove.col] = null;
		this._currentPlayer = lastMove.player;

		return true;
	}

	reset() {
		this._board = [
			[null, null, null],
			[null, null, null],
			[null, null, null],
		];
		this._currentPlayer = "X";
		this._gameOver = false;
		this._winner = null;
		this._winLine = null;
		this._isDraw = false;
		this._moveHistory = [];
	}

	_switchTurn() {
		this._currentPlayer = this._currentPlayer === "X" ? "O" : "X";
	}

	static toIndex(row, col) {
		return row * 3 + col;
	}


	static fromIndex(index) {
		return {
			row: Math.floor(index / 3),
			col: index % 3,
		};
	}
}
