import { gameData, initGameSettings } from "./game-data.js";
import { elements } from "./listeners.js";
import { showEndDialog, buildGrid } from "./ui-build.js";
import { LeaderBoard } from "./leaderboard.js";
export function getImgs() {
  let imgsLeft = (gameData.size * gameData.size) / 2 - gameData.userImgs.length;
  gameData.userImgs = shuffle(gameData.userImgs);
  if (imgsLeft > 0) {
    gameData.userImgs = gameData.userImgs.concat(
      shuffle(gameData.images).slice(0, imgsLeft),
    );
  }
  return shuffle(gameData.userImgs.concat(gameData.userImgs));
}

export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function startGame() {
  tick();
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.remove("flipped");
  });
}

export function endGame(isWin) {
  clearInterval(gameData.timer);
  gameData.flipAllowed = false;
  let leaderBoard = new LeaderBoard(
    gameData.username,
    gameData.lives - gameData.livesRemain,
    gameData.timeElapsed,
    gameData.size,
    !isWin,
  );
  console.log(leaderBoard);
  console.log(leaderBoard.getScore());
  showEndDialog(isWin);
}

export function restartGame() {
  initGameSettings();
  buildGrid(gameData.size);
}

export function tick() {
  gameData.timer = setInterval(() => {
    gameData.timeElapsed++;
    document.querySelector("#elapsed-time .time").textContent = toClock(
      gameData.timeElapsed,
    );
    elements.timeLeftText.querySelector(".time").textContent = toClock(
      gameData.timeLimitSeconds - gameData.timeElapsed,
    );
    elements.progressBar.style.width = `${(gameData.timeElapsed / gameData.timeLimitSeconds) * 100}%`;
    if (gameData.timeElapsed == gameData.timeLimitSeconds) {
      endGame(false);
    }
  }, 1000);
}
export function toClock(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}
