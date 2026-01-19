import { Cookies } from "../../../common/cookies.js";
import { gameData, initGameSettings } from "./game-data.js";
// let timeLeftText = document.getElementById("time-left");
// let progressBar = document.querySelector(".progress span");
// let livesText = document.getElementById("lives-count");
// let timeInput = document.getElementById("time-input");
// let livesInput = document.getElementById("lives-input");
initGameSettings();
// LISTENERS
// document.getElementById("start").addEventListener("click", () => {
//   initGameSettings();
//   buildGrid(gameData.size);
// });
// document.getElementById("play-again").addEventListener("click", () => {
//   restartGame();
// });
// document.getElementById("settings-btn").addEventListener("click", () => {
//   buildSettings();
// });
// document.getElementById("close-settings").addEventListener("click", () => {
//   document.getElementById("settings-dialog-bg").classList.add("hide");
// });
// timeInput.addEventListener("input", () => {
//   timeInput.style.backgroundImage = `linear-gradient(to right, var(--main-color) ${timeInput.value}%, var(--secondary-text-color) ${timeInput.value}% 100%)`;
//   let v = (timeInput.value / 100) * 300;
//   document.querySelector("#time-settings .settings-row-value").textContent =
//     toClock(v);
//   Cookies.set("timeLimit", v);
// });
// livesInput.addEventListener("input", () => {
//   let lives = Math.floor((livesInput.value / 100) * 4) + 1;
//   livesInput.style.backgroundImage = `linear-gradient(to right, var(--main-color) ${livesInput.value}%, var(--secondary-text-color) ${livesInput.value}% 100%)`;
//   document.querySelector("#lives-settings .settings-row-value").textContent =
//     lives;
//   Cookies.set("lives", lives);
// });
// window.onresize = () => {
//   resizeGrid();
// };

// BUILD UI
// function buildInfo() {
//   if (gameData.timeLimitSeconds == 0) {
//     timeLeftText.style.display = "none";
//     progressBar.style.width = "100%";
//   } else {
//     progressBar.style.display = "block";
//     progressBar.style.width = "0%";
//   }
//   livesText.textContent = `x${gameData.livesRemain}`;
// }
// function showEndDialog(isWin) {
//   let dialog = document.getElementById("game-end");
//   dialog.classList.remove("hide");
//   if (isWin) {
//     dialog.classList.add("win");
//     dialog
//       .querySelector("#game-end-icon-cont i")
//       .classList.remove("fa-face-frown");
//     dialog
//       .querySelector("#game-end-icon-cont i")
//       .classList.add("fa-face-smile");
//     dialog.querySelector("#game-end-title").textContent = "You Won!";
//     dialog.querySelector("#game-end-msg").textContent =
//       "Congratulations! You matched all pairs successfully.";
//   } else {
//     dialog.classList.remove("win");
//     dialog
//       .querySelector("#game-end-icon-cont i")
//       .classList.remove("fa-face-smile");
//     dialog
//       .querySelector("#game-end-icon-cont i")
//       .classList.add("fa-face-frown");
//     dialog.querySelector("#game-end-title").textContent = "Game Over";
//     dialog.querySelector("#game-end-msg").textContent = "Better Luck Next Time";
//   }
//   dialog.querySelector("#game-end-time .game-end-val").textContent = toClock(
//     gameData.timeElapsed,
//   );
//   dialog.querySelector("#game-end-mistakes .game-end-val").textContent =
//     gameData.lives - gameData.livesRemain;
// }
// function initGameSettings() {
//   document.getElementById("game-grid").innerHTML = "";
//   document.getElementById("game-end").classList.add("hide");
//   gameData.images = [
//     "https://wallpapercave.com/wp/wp9583413.jpg",
//     "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/12/gojo-win.jpg?q=49&fit=crop&w=528&h=374&dpr=2",
//   ];
//   gameData.userImgs = [
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxIgvIrw7Cdcd18NDXo9PX6oRpNo8H5q6_Hw&s",
//   ];
//   gameData.timeLimitSeconds = Cookies.get("timeLimit") || 0;
//   gameData.timeElapsed = 0;
//   gameData.lives = Cookies.get("lives") || 3;
//   gameData.size = Cookies.get("size") || 2;
//   gameData.pairs = 0;
//   gameData.livesRemain = gameData.lives;
//   gameData.flipAllowed = true;
//   gameData.flippedCard = undefined;
// }
// function resizeGrid() {
//   let totalSpace = Math.min(window.innerHeight - 80, window.innerWidth - 20);
//   let grid = document.getElementById("game-grid");
//   grid.style.width = totalSpace + "px";
//   grid.style.height = totalSpace + "px";
//   grid.style.gridTemplateColumns = `repeat(${gameData.size}, 1fr)`;
//   grid.style.gridTemplateRows = `repeat(${gameData.size}, 1fr)`;
//   return grid;
// }
// function buildGrid(size) {
//   buildInfo();
//   let grid = resizeGrid();
//   let imgs = getImgs();
//   for (let i = 0; i < size * size; i++) {
//     grid.appendChild(buildCard(imgs[i]));
//   }
//   document.getElementById("pre-game").classList.add("playing");
//   document.getElementById("game-play-ui").classList.add("playing");
//   grid.scrollIntoView({ behavior: "smooth" });
//   setTimeout(() => {
//     startGame(tick);
//   }, 1000);
// }
// function buildCard(imgUrl) {
//   let card = document.createElement("div");
//   card.classList.add("card", "flipped");
//   card.style.width = "100%";
//   card.style.height = "100%";
//   let front = document.createElement("div");
//   let back = document.createElement("div");
//   front.classList.add("card-face", "card-front");
//   back.classList.add("card-face", "card-back");

//   let questionMark = document.createElement("i");
//   questionMark.textContent = "?";
//   front.appendChild(questionMark);

//   let img = document.createElement("img");
//   img.src = imgUrl;
//   back.appendChild(img);

//   card.appendChild(front);
//   card.appendChild(back);

//   card.addEventListener("click", () => flipCard(card));

//   return card;
// }
// function buildSettings() {
//   initGameSettings();
//   document.getElementById("settings-dialog-bg").classList.remove("hide");
//   buildGridSettings();
//   buildTimeSettings();
// }
// function buildGridSettings() {
//   document.querySelectorAll("#grid-options-row span").forEach((e) => {
//     if (e.getAttribute("value") == gameData.size) {
//       e.classList.add("selected");
//     } else {
//       e.classList.remove("selected");
//     }
//     e.addEventListener("click", () => {
//       document
//         .querySelector("#grid-options-row span.selected")
//         .classList.remove("selected");
//       e.classList.add("selected");
//       Cookies.set("size", e.getAttribute("value"));
//     });
//   });
// }
// function buildTimeSettings() {
//   let v = (gameData.timeLimitSeconds / 300) * 100;
//   timeInput.value = v;
//   document.querySelector("#time-settings .settings-row-value").textContent =
//     toClock(gameData.timeLimitSeconds);
//   timeInput.style.backgroundImage = `linear-gradient(to right, var(--main-color) ${timeInput.value}%, var(--secondary-text-color) ${timeInput.value}% 100%)`;
// }

// function flipCard(card) {
//   if (!gameData.flipAllowed) {
//     return;
//   }
//   if (!card.classList.contains("flipped")) {
//     card.classList.add("flipped");
//     if (gameData.flippedCard == undefined) {
//       gameData.flippedCard = card;
//     } else {
//       if (getCardImg(gameData.flippedCard) == getCardImg(card)) {
//         gameData.flippedCard.classList.add("right");
//         card.classList.add("right");
//         gameData.pairs++;
//         if (gameData.pairs == (gameData.size * gameData.size) / 2) {
//           endGame(true);
//         }
//         gameData.flippedCard = undefined;
//       } else {
//         gameData.flipAllowed = false;
//         gameData.livesRemain--;
//         livesText.textContent = `x${gameData.livesRemain}`;
//         if (gameData.livesRemain == 0) {
//           endGame(false);
//           return;
//         }
//         setTimeout(() => {
//           gameData.flippedCard.classList.remove("flipped");
//           card.classList.remove("flipped");
//           gameData.flippedCard = undefined;
//           gameData.flipAllowed = true;
//         }, 500);
//       }
//     }
//   }
// }

// CONTROL GAME
// function startGame() {
//   tick();
//   document.querySelectorAll(".card").forEach((card) => {
//     card.classList.remove("flipped");
//   });
// }

// function endGame(isWin) {
//   clearInterval(gameData.timer);
//   gameData.flipAllowed = false;
//   showEndDialog(isWin);
// }

// function restartGame() {
//   initGameSettings();
//   buildGrid(gameData.size);
// }

// HELPERS
// function tick() {
//   gameData.timer = setInterval(() => {
//     gameData.timeElapsed++;
//     document.querySelector("#elapsed-time .time").textContent = toClock(
//       gameData.timeElapsed ,
//     );
//     timeLeftText.querySelector(".time").textContent = toClock(
//       gameData.timeLimitSeconds - gameData.timeElapsed,
//     );
//     progressBar.style.width = `${(gameData.timeElapsed / gameData.timeLimitSeconds) * 100}%`;
//     if (gameData.timeElapsed == gameData.timeLimitSeconds) {
//       endGame(false);
//     }
//   }, 1000);
// }

// function toClock(seconds) {
//   let minutes = Math.floor(seconds / 60);
//   let remainingSeconds = Math.floor(seconds % 60);
//   return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
// }
// function getImgs() {
//   let imgsLeft = (gameData.size * gameData.size) / 2 - gameData.userImgs.length;
//   gameData.userImgs = shuffle(gameData.userImgs);
//   if (imgsLeft > 0) {
//     gameData.userImgs = gameData.userImgs.concat(
//       shuffle(gameData.images).slice(0, imgsLeft),
//     );
//   }
//   return shuffle(gameData.userImgs.concat(gameData.userImgs));
// }
// function shuffle(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// }
// function getCardImg(card) {
//   return card.getElementsByTagName("img")[0].src;
// }
