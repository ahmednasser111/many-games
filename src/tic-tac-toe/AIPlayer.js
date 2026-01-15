import { Rules } from './Rules.js';

export class AIPlayer {
  constructor(symbol) {
    this.symbol = symbol;
    this.name = 'AI';
    this.isAI = true;
  }

  getMove(board) {
    const validMoves = Rules.getValidMoves(board);
    
    if (validMoves.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
  }

  async getMoveWithDelay(board, delay = 500) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.getMove(board));
      }, delay);
    });
  }
}
