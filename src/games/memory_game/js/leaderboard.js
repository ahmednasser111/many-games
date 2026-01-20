export function LeaderBoard(
  username,
  mistakes,
  time,
  size,
  fail = false,
  score,
) {
  this.username = username;
  this.mistakes = mistakes;
  this.date = new Date();
  this.time = time;
  this.size = size;
  this.fail = fail;
}

LeaderBoard.prototype.getScore = function () {
  if (this.fail) {
    return 0;
  }
  let score = (this.size * this.size) / this.time;
  return Math.round(score * (1 / (1 + this.mistakes)) * 100);
};

export function getLeaderBoard() {
  let data = JSON.parse(window.localStorage.getItem("leaderboard") || "[]");
  return data
    .map((e) => {
      return new LeaderBoard(e.username, e.mistakes, e.time, e.size, e.fail);
    })
    .sort((a, b) => b.getScore() - a.getScore());
}

export function addToLeaderBoard(leader) {
  let data = JSON.parse(window.localStorage.getItem("leaderboard") || "[]");
  data.push(leader);
  window.localStorage.setItem("leaderboard", JSON.stringify(data));
}

export function removeFromLeaderBoard(index) {
  let data = JSON.parse(window.localStorage.getItem("leaderboard") || "[]");
  data.splice(index, 1);
  window.localStorage.setItem("leaderboard", JSON.stringify(data));
}
