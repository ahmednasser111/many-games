export function LeaderBoard(username, mistakes, time, size, fail = false) {
  this.username = username;
  this.mistakes = mistakes;
  this.time = time;
  this.size = size;
  this.fail = fail;
}

LeaderBoard.prototype.getScore = function () {
  return this.fail ? 0 : this.mistakes * 10 + this.time;
};
