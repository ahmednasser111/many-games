var flipAllowed = true;
var flippedCard = undefined;
var images;
let userImgs;
let timeLeftText = document.getElementById("time-left");
let progressBar = document.querySelector(".progress span");
let livesText = document.getElementById("lives-count");
let timeLimitSeconds;
let timeElapsed;
let lives;
let size;
let pairs;
let livesRemain;
let timer;
initGameSettings();
buildSettings();
// LISTENERS
document.getElementById("start").addEventListener("click", () => {
  initGameSettings();
  buildGrid(size);
});
document.getElementById("play-again").addEventListener("click", () => {
  restartGame();
});

// BUILD UI
function buildInfo() {
  if (timeLimitSeconds == 0) {
    timeLeftText.style.display = "none";
    progressBar.style.width = "100%";
  } else {
    progressBar.style.display = "block";
    progressBar.style.width = "0%";
  }
  livesText.textContent = `x${livesRemain}`;
}
function showEndDialog(isWin) {
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
  dialog.querySelector("#game-end-time .game-end-val").textContent =
    toClock(timeElapsed);
  dialog.querySelector("#game-end-mistakes .game-end-val").textContent =
    lives - livesRemain;
}
function initGameSettings() {
  document.getElementById("game-grid").innerHTML = "";
  document.getElementById("game-end").classList.add("hide");
  images = [
    "https://wallpapercave.com/wp/wp9583413.jpg",
    "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/12/gojo-win.jpg?q=49&fit=crop&w=528&h=374&dpr=2",
  ];
  userImgs = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxIgvIrw7Cdcd18NDXo9PX6oRpNo8H5q6_Hw&s",
  ];
  timeLimitSeconds = 50;
  timeElapsed = 0;
  lives = 2;
  size = 2;
  pairs = 0;
  livesRemain = lives;
  flipAllowed = true;
  flippedCard = undefined;
}
function buildGrid(size) {
  buildInfo();
  let totalSpace = Math.min(window.innerHeight - 80, window.innerWidth - 20);
  let availSpace = totalSpace - (size + 1) * 10;
  let cardSize = availSpace / size;
  let grid = document.getElementById("game-grid");
  grid.style.width = totalSpace + "px";
  grid.style.height = totalSpace + "px";
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  let imgs = getImgs();
  for (let i = 0; i < size * size; i++) {
    grid.appendChild(buildCard(cardSize, imgs[i]));
  }
  document.getElementById("pre-game").classList.add("playing");
  document.getElementById("game-play-ui").classList.add("playing");
  grid.scrollIntoView({ behavior: "smooth" });
  setTimeout(() => {
    startGame(tick);
  }, 1000);
}
function buildCard(cardSize, imgUrl) {
  let card = document.createElement("div");
  card.classList.add("card", "flipped");
  card.style.width = cardSize + "px";
  card.style.height = cardSize + "px";
  let front = document.createElement("div");
  let back = document.createElement("div");
  front.classList.add("card-face", "card-front");
  back.classList.add("card-face", "card-back");

  let questionMark = document.createElement("i");
  questionMark.textContent = "?";
  front.appendChild(questionMark);

  let img = document.createElement("img");
  img.src = imgUrl;
  img.width = cardSize;
  img.height = cardSize;
  back.appendChild(img);

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener("click", (e) => flipCard(card));

  return card;
}
function buildSettings() {
  buildGridSettings();
}
function buildGridSettings() {
  document.querySelectorAll("#grid-options-row span").forEach((e) => {
    if (e.getAttribute("value") == size) {
      e.classList.add("selected");
    } else {
      e.classList.remove("selected");
    }
    e.addEventListener("click", () => {
      document
        .querySelector("#grid-options-row span.selected")
        .classList.remove("selected");
      e.classList.add("selected");
    });
  });
}
function buildTimeSettings() {}

function flipCard(card) {
  if (!flipAllowed) {
    return;
  }
  if (!card.classList.contains("flipped")) {
    card.classList.add("flipped");
    if (flippedCard == undefined) {
      flippedCard = card;
    } else {
      if (getCardImg(flippedCard) == getCardImg(card)) {
        flippedCard.classList.add("right");
        card.classList.add("right");
        pairs++;
        if (pairs == (size * size) / 2) {
          endGame(true);
        }
        flippedCard = undefined;
      } else {
        flipAllowed = false;
        livesRemain--;
        livesText.textContent = `x${livesRemain}`;
        if (livesRemain == 0) {
          endGame(false);
          return;
        }
        setTimeout(() => {
          flippedCard.classList.remove("flipped");
          card.classList.remove("flipped");
          flippedCard = undefined;
          flipAllowed = true;
        }, 500);
      }
    }
  }
}

// CONTROL GAME
function startGame() {
  tick();
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.remove("flipped");
  });
}

function endGame(isWin) {
  clearInterval(timer);
  flipAllowed = false;
  showEndDialog(isWin);
}

function restartGame() {
  initGameSettings();
  buildGrid(size);
}

// HELPERS
function tick() {
  timer = setInterval(() => {
    timeElapsed++;
    document.querySelector("#elapsed-time .time").textContent =
      toClock(timeElapsed);
    timeLeftText.querySelector(".time").textContent = toClock(
      timeLimitSeconds - timeElapsed,
    );
    progressBar.style.width = `${(timeElapsed / timeLimitSeconds) * 100}%`;
    if (timeElapsed == timeLimitSeconds) {
      endGame(false);
    }
  }, 1000);
}

function toClock(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}
function getImgs() {
  let imgsLeft = (size * size) / 2 - userImgs.length;
  userImgs = shuffle(userImgs);
  if (imgsLeft > 0) {
    userImgs = userImgs.concat(shuffle(images).slice(0, imgsLeft));
  }
  return shuffle(userImgs.concat(userImgs));
}
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function getCardImg(card) {
  return card.getElementsByTagName("img")[0].src;
}
