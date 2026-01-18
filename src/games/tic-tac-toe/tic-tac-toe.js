class TicTacToe {
	constructor() {
		this.board = Array(9).fill(null);
		this.currentPlayer = "X";
		this.gameOver = false;
		this.mode = "2player";
		this.scores = { x: 0, o: 0, draw: 0 };
		this.winPatterns = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];
	}

	init() {
		this.createBoard();
		this.attachEventListeners();
		this.loadScores();
		this.updateStatus();
		this.selectedCell = 0;
		this.updateSelection();
	}

	createBoard() {
		const boardEl = document.getElementById("board");
		boardEl.setAttribute("role", "grid");
		boardEl.setAttribute("aria-label", "Tic Tac Toe board");
		boardEl.innerHTML = "";

		for (let i = 0; i < 9; i++) {
			const cell = document.createElement("button");
			cell.className = "cell";
			cell.dataset.index = i;
			cell.setAttribute("role", "gridcell");
			cell.setAttribute("aria-label", `Cell ${i + 1} empty`);
			cell.addEventListener("click", () => this.handleCellClick(i));
			boardEl.appendChild(cell);
		}
	}

	attachEventListeners() {
		document
			.getElementById("reset")
			.addEventListener("click", () => this.resetGame());
		document
			.getElementById("reset-scores")
			.addEventListener("click", () => this.resetScores());

		document.querySelectorAll(".mode-btn").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				document
					.querySelectorAll(".mode-btn")
					.forEach((b) => b.classList.remove("active"));
				e.target.classList.add("active");
				this.mode = e.target.dataset.mode;
				this.resetGame();
			});
		});

		document.addEventListener("keydown", (e) => this.handleKeydown(e));
	}

	handleCellClick(index) {
		if (this.board[index] || this.gameOver) return;
		this.makeMove(index);

		if (!this.gameOver && this.mode === "ai" && this.currentPlayer === "O") {
			setTimeout(() => this.aiMove(), 500);
		}
	}

	handleKeydown(e) {
		if (this.gameOver) return;
		const key = e.key.toLowerCase();
		let row = Math.floor(this.selectedCell / 3);
		let col = this.selectedCell % 3;

		if (key === "arrowup" || key === "w") {
			if (row > 0) row--;
		} else if (key === "arrowdown" || key === "s") {
			if (row < 2) row++;
		} else if (key === "arrowleft" || key === "a") {
			if (col > 0) col--;
		} else if (key === "arrowright" || key === "d") {
			if (col < 2) col++;
		} else if (key === "enter" || key === " ") {
			this.handleCellClick(this.selectedCell);
			return;
		} else {
			return;
		}

		this.selectedCell = row * 3 + col;
		this.updateSelection();
	}

	updateSelection() {
		const cells = document.querySelectorAll(".cell");
		cells.forEach((cell, i) => {
			cell.classList.toggle("selected", i === this.selectedCell);
			cell.setAttribute(
				"aria-selected",
				i === this.selectedCell ? "true" : "false"
			);
		});
	}

	makeMove(index) {
		if (index < 0 || index > 8) {
			console.warn("[TTT] invalid move index", index);
			return;
		}
		this.board[index] = this.currentPlayer;
		this.updateCell(index);
		console.debug("[TTT] move", { player: this.currentPlayer, index });

		const winner = this.checkWinner();
		if (winner) {
			this.endGame(winner);
		} else if (this.board.every((cell) => cell !== null)) {
			this.endGame("draw");
		} else {
			this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
			this.updateStatus();
		}
	}

	aiMove() {
		if (this.gameOver) return;
		const emptyCells = this.board
			.map((cell, i) => (cell === null ? i : null))
			.filter((i) => i !== null);
		if (emptyCells.length === 0) return;
		const randomIndex = Math.floor(Math.random() * emptyCells.length);
		const move = emptyCells[randomIndex];
		console.debug("[TTT] aiMove", { move });
		this.makeMove(move);
	}

	updateCell(index) {
		const cells = document.querySelectorAll(".cell");
		const cell = cells[index];
		cell.textContent = this.board[index];
		cell.classList.add("taken", this.board[index].toLowerCase());
		cell.setAttribute("aria-label", `Cell ${index + 1} ${this.board[index]}`);
	}

	checkWinner() {
		for (const pattern of this.winPatterns) {
			const [a, b, c] = pattern;
			if (
				this.board[a] &&
				this.board[a] === this.board[b] &&
				this.board[a] === this.board[c]
			) {
				this.highlightWinningCells(pattern);
				return this.board[a];
			}
		}
		return null;
	}

	highlightWinningCells(pattern) {
		const cells = document.querySelectorAll(".cell");
		pattern.forEach((index) => {
			cells[index].classList.add("winner");
		});
	}

	endGame(result) {
		this.gameOver = true;
		if (result === "draw") {
			this.scores.draw++;
			this.updateStatus("It's a Draw! 🤝");
		} else {
			if (result === "X") this.scores.x++;
			else this.scores.o++;
			this.updateStatus(`Player ${result} Wins! 🎉`);
		}
		this.saveScores();
		this.updateScoreDisplay();
	}

	updateStatus(message) {
		const statusEl = document.getElementById("status");
		statusEl.setAttribute("aria-live", "polite");
		if (message) {
			statusEl.textContent = message;
		} else {
			const playerName =
				this.mode === "ai" && this.currentPlayer === "O"
					? "AI"
					: `Player ${this.currentPlayer}`;
			statusEl.textContent = `${playerName}'s turn`;
		}
	}

	resetGame() {
		this.board = Array(9).fill(null);
		this.currentPlayer = "X";
		this.gameOver = false;
		const cells = document.querySelectorAll(".cell");
		cells.forEach((cell) => {
			cell.textContent = "";
			cell.className = "cell";
			const idx = parseInt(cell.dataset.index, 10);
			cell.setAttribute(
				"aria-label",
				`Cell ${isNaN(idx) ? "" : idx + 1} empty`
			);
		});
		this.updateStatus();
		this.selectedCell = 0;
		this.updateSelection();
	}

	updateScoreDisplay() {
		document.getElementById("x-score").textContent = this.scores.x;
		document.getElementById("o-score").textContent = this.scores.o;
		document.getElementById("draw-score").textContent = this.scores.draw;
	}

	saveScores() {
		localStorage.setItem("ttt-scores", JSON.stringify(this.scores));
	}

	loadScores() {
		const saved = localStorage.getItem("ttt-scores");
		if (saved) {
			this.scores = JSON.parse(saved);
			this.updateScoreDisplay();
		}
	}

	resetScores() {
		this.scores = { x: 0, o: 0, draw: 0 };
		this.saveScores();
		this.updateScoreDisplay();
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const game = new TicTacToe();
	game.init();
	window.TicTacToe = TicTacToe;
});
