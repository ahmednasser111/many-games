export class Series {
	constructor(bestOf) {
		this.bestOf = bestOf;
		this.x = 0;
		this.o = 0;
		this.draw = 0;
		this.over = false;
	}

	record(result) {
		if (this.over) {
			return { over: true, winnerSymbol: null };
		}

		if (result === "draw") this.draw++;
		else if (result === "X") this.x++;
		else if (result === "O") this.o++;

		const needed = Math.ceil(this.bestOf / 2);
		if (this.x >= needed || this.o >= needed) {
			this.over = true;
			return { over: true, winnerSymbol: this.x >= needed ? "X" : "O" };
		}

		return { over: false, winnerSymbol: null };
	}
}
