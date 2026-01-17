import { Cookies } from '../../common/cookies.js';

const STATS_KEY = 'manyGames_ttt_stats';
const MAX_HISTORY = 50; // Limit stored matches

export class StatsStore {
  constructor() {
    this._history = [];
    this.load();
  }

  load() {
    this._history = Cookies.getJSON(STATS_KEY) || [];
  }

  save() {
    if (this._history.length > MAX_HISTORY) {
      this._history = this._history.slice(-MAX_HISTORY);
    }
    Cookies.setJSON(STATS_KEY, this._history);
  }

  addMatch(match) {
    this._history.push({
      ...match,
      id: Date.now(),
      timestamp: new Date().toISOString()
    });
    this.save();
  }

  getHistory() {
    return [...this._history];
  }

  getHistoryPaginated(page = 1, perPage = 10) {
    const total = this._history.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const matches = this._history.slice().reverse().slice(start, start + perPage);

    return { matches, total, page, totalPages };
  }

  getStats(username) {
    const stats = { wins: 0, losses: 0, draws: 0, total: 0 };

    for (const match of this._history) {
      const playerX = match.players?.x?.name;
      const playerO = match.players?.o?.name;
      
      if (playerX !== username && playerO !== username) continue;

      stats.total++;

      if (!match.winner) {
        stats.draws++;
      } else {
        const winnerName = match.winner === 'X' ? playerX : playerO;
        if (winnerName === username) {
          stats.wins++;
        } else {
          stats.losses++;
        }
      }
    }

    return stats;
  }

  /**
   * Clear all history
   */
  clearHistory() {
    this._history = [];
    this.save();
  }

  getRecent(count = 5) {
    return this._history.slice(-count).reverse();
  }
}
