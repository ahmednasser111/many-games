export function renderLeaderboard(container, statsStore) {
	if (!container) return;

	const history = statsStore.getHistory();
	const names = new Set();
	for (const match of history) {
		const x = match.players?.x?.name;
		const o = match.players?.o?.name;
		if (x) names.add(x);
		if (o) names.add(o);
	}

	const rows = Array.from(names)
		.map((name) => ({ name, ...statsStore.getStats(name) }))
		.filter((r) => r.total > 0)
		.map((r) => ({
			...r,
			winRate: r.total ? r.wins / r.total : 0,
		}))
		.sort((a, b) => {
			if (b.wins !== a.wins) return b.wins - a.wins;
			return b.winRate - a.winRate;
		});

	if (rows.length === 0) {
		container.textContent = "No matches yet.";
		return;
	}

	const table = document.createElement("table");

	const thead = document.createElement("thead");
	const headRow = document.createElement("tr");
	["Player", "W", "L", "D", "Total"].forEach((t) => {
		const th = document.createElement("th");
		th.textContent = t;
		headRow.appendChild(th);
	});
	thead.appendChild(headRow);
	table.appendChild(thead);

	const tbody = document.createElement("tbody");
	rows.slice(0, 10).forEach((r) => {
		const tr = document.createElement("tr");
		const values = [r.name, r.wins, r.losses, r.draws, r.total];
		values.forEach((v) => {
			const td = document.createElement("td");
			td.textContent = String(v);
			tr.appendChild(td);
		});
		tbody.appendChild(tr);
	});
	table.appendChild(tbody);

	container.innerHTML = "";
	container.appendChild(table);
}
