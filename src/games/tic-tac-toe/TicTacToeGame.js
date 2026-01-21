import { Settings } from "./Settings.js";
import { StatsStore } from "./StatsStore.js";
import { Series } from "./series.js";
import { renderLeaderboard } from "./leaderboard.js";

export class TicTacToeGame {
	constructor() {
		this.settings = new Settings();
		this.statsStore = new StatsStore();

		this.board = Array(9).fill(null);
		this.currentPlayer = "X";
		this.gameOver = false;
		this.mode = "2player";
		this.scores = { x: 0, o: 0, draw: 0 };
		this.series = null;
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
		this._wireDialogs();
		this._applySettingsToUI();
		this._initSeriesFromSettings();
		this._updateSeriesStatus();
		this.createBoard();
		this.attachEventListeners();
		this.loadScores();
		this.updateStatus();
		this.selectedCell = 0;
		this.updateSelection();
	}

	_getSettings() {
		return this.settings.getAll();
	}

	_getPlayerName(symbol) {
		const s = this._getSettings();
		if (symbol === "X") return s.username || "Guest";
		if (this.mode === "ai") return "AI";
		return s.player2Name && s.player2Name.trim() ? s.player2Name.trim() : "Player 2";
	}

	_updateScoreLabels() {
		const xLabel = document.getElementById("x-score-label");
		const oLabel = document.getElementById("o-score-label");
		if (xLabel) xLabel.textContent = `${this._getPlayerName("X")} (X) Wins`;
		if (oLabel) oLabel.textContent = `${this._getPlayerName("O")} (O) Wins`;
	}

	_updateThemeToggleIcon() {
		const s = this._getSettings();
		const btn = document.getElementById("theme-toggle");
		if (!btn) return;
		const isDark = s.theme === "dark";
		btn.textContent = isDark ? "☀️" : "🌙";
		btn.setAttribute("aria-pressed", isDark ? "true" : "false");
		btn.setAttribute(
			"aria-label",
			isDark ? "Toggle light mode" : "Toggle dark mode"
		);
	}

	_detectPlayer2Name() {
		const s = this._getSettings();
		if (s.player2Name && s.player2Name.trim()) return;
		const me = (s.username || "Guest").trim();
		const history = this.statsStore.getHistory().slice().reverse();
		for (const match of history) {
			const x = match.players?.x?.name;
			const o = match.players?.o?.name;
			if (!x || !o) continue;
			if (x === me && o !== "AI") {
				this.settings.update({ player2Name: o });
				return;
			}
			if (o === me && x !== "AI") {
				this.settings.update({ player2Name: x });
				return;
			}
		}
	}

	_applySettingsToUI() {
		this._detectPlayer2Name();
		const s = this._getSettings();
		const usernameInput = document.getElementById("username-input");
		const player2Input = document.getElementById("player2-input");
		const xColorInput = document.getElementById("x-color-input");
		const oColorInput = document.getElementById("o-color-input");
		const bestOfSelect = document.getElementById("bestof-select");

		if (usernameInput) usernameInput.value = s.username || "Guest";
		if (player2Input) player2Input.value = s.player2Name || "";
		if (xColorInput) xColorInput.value = s.xColor;
		if (oColorInput) oColorInput.value = s.oColor;
		if (bestOfSelect) bestOfSelect.value = String(s.bestOf || 1);

		this._updateThemeToggleIcon();
		this._updateScoreLabels();
	}

	_initSeriesFromSettings() {
		const s = this._getSettings();
		const bestOf = Number(s.bestOf || 1);
		this.series = bestOf > 1 ? new Series(bestOf) : null;
	}

	_resetSeries() {
		this._initSeriesFromSettings();
		this._updateSeriesStatus();
	}

	_updateSeriesStatus() {
		const el = document.getElementById("series-status");
		if (!el) return;
		if (!this.series) {
			el.textContent = "";
			return;
		}
		const xName = this._getPlayerName("X");
		const oName = this._getPlayerName("O");
		el.textContent = `Best of ${this.series.bestOf}: ${xName} ${this.series.x} - ${this.series.o} ${oName} (Draws ${this.series.draw})`;
	}

	_wireDialogs() {
		const settingsToggle = document.getElementById("settings-toggle");
		const leaderboardToggle = document.getElementById("leaderboard-toggle");
		const themeToggle = document.getElementById("theme-toggle");

		const settingsDialog = document.getElementById("settings-dialog");
		const leaderboardDialog = document.getElementById("leaderboard-dialog");
		const settingsClose = document.getElementById("settings-close");
		const leaderboardClose = document.getElementById("leaderboard-close");

		const closeDialog = (dialogEl, toggleBtn) => {
			if (!dialogEl) return;
			dialogEl.classList.add("hidden");
			if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
		};

		const openDialog = (dialogEl, toggleBtn) => {
			if (!dialogEl) return;
			dialogEl.classList.remove("hidden");
			if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "true");
		};

		if (settingsToggle && settingsDialog) {
			settingsToggle.addEventListener("click", () => {
				this._applySettingsToUI();
				openDialog(settingsDialog, settingsToggle);
			});
		}
		if (settingsClose && settingsDialog) {
			settingsClose.addEventListener("click", () =>
				closeDialog(settingsDialog, settingsToggle)
			);
		}
		if (settingsDialog) {
			settingsDialog.addEventListener("click", (e) => {
				if (e.target === settingsDialog)
					closeDialog(settingsDialog, settingsToggle);
			});
		}

		if (leaderboardToggle && leaderboardDialog) {
			leaderboardToggle.addEventListener("click", () => {
				this.renderLeaderboard();
				openDialog(leaderboardDialog, leaderboardToggle);
			});
		}
		if (leaderboardClose && leaderboardDialog) {
			leaderboardClose.addEventListener("click", () =>
				closeDialog(leaderboardDialog, leaderboardToggle)
			);
		}
		if (leaderboardDialog) {
			leaderboardDialog.addEventListener("click", (e) => {
				if (e.target === leaderboardDialog)
					closeDialog(leaderboardDialog, leaderboardToggle);
			});
		}

		if (themeToggle) {
			themeToggle.addEventListener("click", () => {
				const s = this._getSettings();
				const next = s.theme === "dark" ? "light" : "dark";
				this.settings.update({ theme: next });
				this._updateThemeToggleIcon();
			});
		}

		const usernameInput = document.getElementById("username-input");
		if (usernameInput) {
			usernameInput.addEventListener("input", () => {
				this.settings.update({ username: usernameInput.value });
				this._updateScoreLabels();
				this.updateStatus();
				this._updateSeriesStatus();
			});
		}

		const player2Input = document.getElementById("player2-input");
		if (player2Input) {
			player2Input.addEventListener("input", () => {
				this.settings.update({ player2Name: player2Input.value });
				this._updateScoreLabels();
				this.updateStatus();
				this._updateSeriesStatus();
			});
		}

		const xColorInput = document.getElementById("x-color-input");
		if (xColorInput) {
			xColorInput.addEventListener("input", () => {
				this.settings.update({ xColor: xColorInput.value });
			});
		}

		const oColorInput = document.getElementById("o-color-input");
		if (oColorInput) {
			oColorInput.addEventListener("input", () => {
				this.settings.update({ oColor: oColorInput.value });
			});
		}

		const bestOfSelect = document.getElementById("bestof-select");
		if (bestOfSelect) {
			bestOfSelect.addEventListener("change", () => {
				const bestOf = Number(bestOfSelect.value || 1);
				this.settings.update({ bestOf });
				this._resetSeries();
			});
		}
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
				this._updateScoreLabels();
				this._updateSeriesStatus();
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
			cell.setAttribute("aria-selected", i === this.selectedCell ? "true" : "false");
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
			if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
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
			this.updateStatus(`${this._getPlayerName(result)} Wins! 🎉`);
		}

		this.statsStore.addMatch({
			mode: this.mode,
			winner: result === "draw" ? null : result,
			players: {
				x: { name: this._getPlayerName("X") },
				o: { name: this._getPlayerName("O") },
			},
		});

		if (this.series && !this.series.over) {
			const seriesResult = this.series.record(result);
			if (seriesResult.over && seriesResult.winnerSymbol) {
				this.updateStatus(
					`Series Winner: ${this._getPlayerName(seriesResult.winnerSymbol)} 🎉`
				);
			}
			this._updateSeriesStatus();
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
			const name = this._getPlayerName(this.currentPlayer);
			statusEl.textContent = `${name} (${this.currentPlayer})'s turn`;
		}
	}

	resetGame() {
		this.board = Array(9).fill(null);
		this.currentPlayer = "X";
		this.gameOver = false;
		if (this.series?.over) {
			this._resetSeries();
		}
		const cells = document.querySelectorAll(".cell");
		cells.forEach((cell) => {
			cell.textContent = "";
			cell.className = "cell";
			const idx = parseInt(cell.dataset.index, 10);
			cell.setAttribute("aria-label", `Cell ${isNaN(idx) ? "" : idx + 1} empty`);
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
		this._resetSeries();
	}

	renderLeaderboard() {
		const container = document.getElementById("leaderboard-content");
		renderLeaderboard(container, this.statsStore);
	}
}
