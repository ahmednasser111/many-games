import { gameData } from "./game-data.js";
import { elements } from "./listeners.js";
import { getImgs, startGame, tick, toClock, endGame } from "./utils.js";
export function buildGrid(size) {
  buildInfo();
  let grid = resizeGrid();
  let imgs = getImgs();
  for (let i = 0; i < size * size; i++) {
    grid.appendChild(buildCard(imgs[i]));
  }
  document.getElementById("pre-game").classList.add("playing");
  document.getElementById("game-play-ui").classList.add("playing");
  grid.scrollIntoView({ behavior: "smooth" });
  setTimeout(() => {
    startGame(tick);
  }, 1000);
}

export function buildInfo() {
  if (gameData.timeLimitSeconds == 0) {
    elements.timeLeftText.style.display = "none";
    elements.progressBar.style.width = "100%";
  } else {
    elements.progressBar.style.display = "block";
    elements.progressBar.style.width = "0%";
  }
  elements.livesText.textContent = `x${gameData.livesRemain}`;
}
export function resizeGrid() {
  let totalSpace = Math.min(window.innerHeight - 80, window.innerWidth - 20);
  let grid = document.getElementById("game-grid");
  grid.style.width = totalSpace + "px";
  grid.style.height = totalSpace + "px";
  grid.style.gridTemplateColumns = `repeat(${gameData.size}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${gameData.size}, 1fr)`;
  return grid;
}

export function buildCard(imgUrl) {
  let card = document.createElement("div");
  card.classList.add("card", "flipped");
  card.style.width = "100%";
  card.style.height = "100%";
  let front = document.createElement("div");
  let back = document.createElement("div");
  front.classList.add("card-face", "card-front");
  back.classList.add("card-face", "card-back");

  let questionMark = document.createElement("i");
  questionMark.textContent = "?";
  front.appendChild(questionMark);

  let img = document.createElement("img");
  img.src = imgUrl;
  back.appendChild(img);

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener("click", () => flipCard(card));

  return card;
}

export function showEndDialog(isWin) {
  let dialog = document.getElementById("game-end");
  dialog.classList.remove("hide");
  if (isWin) {
    dialog.classList.add("win");
    dialog
      .querySelector("#game-end-icon-cont i")
      .classList.remove("fa-face-frown");
    dialog
      .querySelector("#game-end-icon-cont i")
      .classList.add("fa-face-smile");
    dialog.querySelector("#game-end-title").textContent = "You Won!";
    dialog.querySelector("#game-end-msg").textContent =
      "Congratulations! You matched all pairs successfully.";
  } else {
    dialog.classList.remove("win");
    dialog
      .querySelector("#game-end-icon-cont i")
      .classList.remove("fa-face-smile");
    dialog
      .querySelector("#game-end-icon-cont i")
      .classList.add("fa-face-frown");
    dialog.querySelector("#game-end-title").textContent = "Game Over";
    dialog.querySelector("#game-end-msg").textContent = "Better Luck Next Time";
  }
  dialog.querySelector("#game-end-time .game-end-val").textContent = toClock(
    gameData.timeElapsed,
  );
  dialog.querySelector("#game-end-mistakes .game-end-val").textContent =
    gameData.lives - gameData.livesRemain;
}

export function flipCard(card) {
  if (!gameData.flipAllowed) {
    return;
  }
  if (!card.classList.contains("flipped")) {
    card.classList.add("flipped");
    if (gameData.flippedCard == undefined) {
      gameData.flippedCard = card;
    } else {
      if (getCardImg(gameData.flippedCard) == getCardImg(card)) {
        gameData.flippedCard.classList.add("right");
        card.classList.add("right");
        gameData.pairs++;
        if (gameData.pairs == (gameData.size * gameData.size) / 2) {
          endGame(true);
        }
        gameData.flippedCard = undefined;
      } else {
        gameData.flipAllowed = false;
        gameData.livesRemain--;
        elements.livesText.textContent = `x${gameData.livesRemain}`;
        if (gameData.livesRemain == 0) {
          endGame(false);
          return;
        }
        setTimeout(() => {
          gameData.flippedCard.classList.remove("flipped");
          card.classList.remove("flipped");
          gameData.flippedCard = undefined;
          gameData.flipAllowed = true;
        }, 500);
      }
    }
  }
}
export function getCardImg(card) {
  return card.getElementsByTagName("img")[0].src;
}

export function buildLeaderBoard() {
  let leaderBoard = document.getElementById("leader-dialog-bg");
  leaderBoard.classList.remove("hide");
}
