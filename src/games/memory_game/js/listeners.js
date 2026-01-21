import { gameData, initGameSettings, addUserImg } from "./game-data.js";
import { buildGrid, resizeGrid, buildLeaderBoard } from "./ui-build.js";
import { buildSettings } from "./settings-ui.js";
import { restartGame, toClock } from "./utils.js";
import { Cookies } from "../../../common/cookies.js";
import { clearAllMemoryLeaderBord } from "./leaderboard.js";

let isDark = Cookies.get("theme") == "dark";
if (isDark) {
  document.body.classList.add("dark-theme");
}

export const elements = {
  timeLeftText: document.getElementById("time-left"),
  progressBar: document.querySelector(".progress span"),
  livesText: document.getElementById("lives-count"),
  timeInput: document.getElementById("time-input"),
  livesInput: document.getElementById("lives-input"),
  leaderBoard: document.getElementById("leader-dialog-bg"),
  settingsDialog: document.getElementById("settings-dialog-bg"),
};
document.body.addEventListener("keydown", (e) => {
  if (e.key == "Escape") {
    elements.settingsDialog.classList.add("hide");
    elements.leaderBoard.classList.add("hide");
  }
});
elements.settingsDialog.addEventListener("click", (e) => {
  if (e.target == elements.settingsDialog) {
    elements.settingsDialog.classList.add("hide");
  }
});
elements.leaderBoard.addEventListener("click", (e) => {
  if (e.target == elements.leaderBoard) {
    elements.leaderBoard.classList.add("hide");
  }
});
document.getElementById("back-to-home").addEventListener("click", () => {
  clearInterval(gameData.timer);
  clearTimeout(gameData.startGameTimer);
  clearTimeout(gameData.counter);
  document.getElementById("counter").classList.remove("show");
  document.getElementById("pre-game").classList.remove("playing");
  document.getElementById("game-play-ui").classList.remove("playing");
});
document.getElementById("add-user-img").addEventListener("click", () => {
  addUserImg();
});
document.getElementById("start").addEventListener("click", () => {
  initGameSettings();
  buildGrid(gameData.size);
});
document.getElementById("play-again").addEventListener("click", () => {
  restartGame();
});
document.getElementById("settings-btn").addEventListener("click", () => {
  buildSettings();
});
document.getElementById("leader-btn").addEventListener("click", () => {
  buildLeaderBoard();
});
document.getElementById("close-settings").addEventListener("click", () => {
  document.getElementById("settings-dialog-bg").classList.add("hide");
});
document.getElementById("close-leader").addEventListener("click", () => {
  document.getElementById("leader-dialog-bg").classList.add("hide");
});
document.getElementById("clear-leader").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all leaderboards?")) {
    clearAllMemoryLeaderBord();
    document.querySelectorAll(".leader-entry").forEach((e) => {
      e.remove();
    });
  }
});
elements.timeInput.addEventListener("input", () => {
  elements.timeInput.style.backgroundImage = `linear-gradient(to right, var(--main-color) ${elements.timeInput.value}%, var(--input-color) ${elements.timeInput.value}% 100%)`;
  let v = (elements.timeInput.value / 100) * 300;
  document.querySelector("#time-settings .settings-row-value").textContent =
    toClock(v);
  Cookies.set("timeLimit", v);
});
elements.livesInput.addEventListener("input", () => {
  let lives = Math.floor((elements.livesInput.value / 100) * 4) + 1;
  elements.livesInput.style.backgroundImage = `linear-gradient(to right, var(--main-color) ${elements.livesInput.value}%, var(--input-color) ${elements.livesInput.value}% 100%)`;
  document.querySelector("#lives-settings .settings-row-value").textContent =
    lives;
  Cookies.set("lives", lives);
});
window.onresize = () => {
  resizeGrid();
};
