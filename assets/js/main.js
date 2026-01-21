import { Cookies } from "../../src/common/cookies.js";
/**
 * Home Page Script
 * Handles lightweight enhancements and accessibility behaviors
 */

/**
 * Initialize home page behaviors
 */
let welcomeMsg = document.getElementById("welcome-username");
function initHome() {
  const cards = document.querySelectorAll(".game-card");
  cards.forEach((card) => {
    card.setAttribute("role", "link");
    card.setAttribute(
      "aria-label",
      card.querySelector(".game-title")?.textContent || "Game",
    );
  });
  document.getElementById("random-game").addEventListener("click", () => {
    let games = [
      "src/games/memory_game/memoryGame.html",
      "src/games/tic-tac-toe/tic-tac-toe.html",
    ];
    let random = games[Math.round(Math.random() * (games.length - 1))];
    location.href = random;
  });
  welcomeMsg.textContent = getUserName();
}

function getUserName() {
  let user = (Cookies.get("username") || "").trim();
  if (user == "") {
    user = "Guest";
  }
  return user;
}

let usernameInput = document.getElementById("username-input");
let settingsDialogBg = document.getElementById("settings-bg");
function initSettings() {
  document.getElementById("open-settings").addEventListener("click", () => {
    settingsDialogBg.classList.remove("hide");
    usernameInput.value = getUserName();
  });
  settingsDialogBg.addEventListener("click", (e) => {
    if (e.target == settingsDialogBg) {
      settingsDialogBg.classList.add("hide");
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
      settingsDialogBg.classList.add("hide");
    }
  });

  let isDark = Cookies.get("theme") == "dark";
  let lightThemeBtn = document.getElementById("light-theme-btn");
  let darkThemeBtn = document.getElementById("dark-theme-btn");
  if (isDark) {
    darkThemeBtn.classList.add("active");
    document.body.classList.add("dark-theme");
  } else {
    lightThemeBtn.classList.add("active");
  }
  lightThemeBtn.addEventListener("click", () => {
    setTheme(true, lightThemeBtn, darkThemeBtn);
  });
  darkThemeBtn.addEventListener("click", () => {
    setTheme(false, lightThemeBtn, darkThemeBtn);
  });
  document.getElementById("save-username").addEventListener("click", () => {
    Cookies.set("username", usernameInput.value);
    welcomeMsg.textContent = getUserName();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initHome();
  initSettings();
});

function setTheme(isLight, lightBtn, darkBtn) {
  if (isLight) {
    lightBtn.classList.add("active");
    darkBtn.classList.remove("active");
    document.body.classList.remove("dark-theme");
    Cookies.set("theme", "light");
  } else {
    lightBtn.classList.remove("active");
    darkBtn.classList.add("active");
    document.body.classList.add("dark-theme");
    Cookies.set("theme", "dark");
  }
}
