import { Cookies } from "../../../common/cookies.js";

export const gameData = {
  images: [],
  userImgs: [],
  flippedCard: undefined,
  flipAllowed: true,
  timeLimitSeconds: undefined,
  timeElapsed: undefined,
  lives: undefined,
  size: undefined,
  pairs: undefined,
  livesRemain: undefined,
  timer: undefined,
  score: undefined,
  username: undefined,
};

export function initGameSettings() {
  document.getElementById("game-grid").innerHTML = "";
  document.getElementById("game-end").classList.add("hide");
  // gameData.images = [
  //   "https://wallpapercave.com/wp/wp9583413.jpg",
  //   "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/12/gojo-win.jpg?q=49&fit=crop&w=528&h=374&dpr=2",
  // ];
  gameData.images = [];
  for (let i = 1; i <= 18; i++) {
    gameData.images.push(`./images/grid/${i}.jfif`);
  }
  gameData.userImgs = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxIgvIrw7Cdcd18NDXo9PX6oRpNo8H5q6_Hw&s",
  ];
  gameData.timeLimitSeconds = Cookies.get("timeLimit") || 0;
  gameData.timeElapsed = 0;
  gameData.lives = Cookies.get("lives") || 3;
  gameData.size = Cookies.get("size") || 2;
  gameData.pairs = 0;
  gameData.livesRemain = gameData.lives;
  gameData.flipAllowed = true;
  gameData.flippedCard = undefined;
  gameData.score = 0;
  gameData.username = Cookies.get("username") || "Guest";
}
