import { initGameSettings, gameData, removeUserImg } from "./game-data.js";
import { elements } from "./listeners.js";
import { toClock } from "./utils.js";
import { Cookies } from "../../../common/cookies.js";
export function buildSettings() {
  initGameSettings();
  document.getElementById("settings-dialog-bg").classList.remove("hide");
  buildGridSettings();
  buildTimeSettings();
  buildLivesSettings();
  buildUserImgsSettings();
}
export function buildGridSettings() {
  document.querySelectorAll("#grid-options-row span").forEach((e) => {
    if (e.getAttribute("value") == gameData.size) {
      e.classList.add("selected");
    } else {
      e.classList.remove("selected");
    }
    e.addEventListener("click", () => {
      document
        .querySelector("#grid-options-row span.selected")
        .classList.remove("selected");
      e.classList.add("selected");
      Cookies.set("size", e.getAttribute("value"));
    });
  });
}
export function buildTimeSettings() {
  let v = (gameData.timeLimitSeconds / 300) * 100;
  elements.timeInput.value = v;
  document.querySelector("#time-settings .settings-row-value").textContent =
    toClock(gameData.timeLimitSeconds);
  elements.timeInput.style.backgroundImage = `linear-gradient(to right, var(--main-color) ${elements.timeInput.value}%, var(--input-color) ${elements.timeInput.value}% 100%)`;
}
export function buildLivesSettings() {
  let v = (gameData.lives / 5) * 100;
  elements.livesInput.value = v;
  document.querySelector("#lives-settings .settings-row-value").textContent =
    gameData.lives;
  elements.livesInput.style.backgroundImage = `linear-gradient(to right, var(--main-color) ${v}%, var(--input-color) ${v}% 100%)`;
}

export function buildUserImgsSettings() {
  let cont = document.getElementById("user-img-collection-cont");
  cont.innerHTML = "";
  gameData.userImgs.forEach((e) => {
    let itemCont = document.createElement("div");
    itemCont.classList.add("user-img-item-cont");
    let i = document.createElement("i");
    i.classList.add("fa-solid", "fa-circle-xmark", "delete-user-img");
    i.onclick = () => {
      itemCont.remove();
      removeUserImg(e);
    };
    let imgCont = document.createElement("div");
    imgCont.classList.add("user-img-cont");
    let img = document.createElement("img");
    img.src = e;
    imgCont.appendChild(img);
    itemCont.appendChild(i);
    itemCont.appendChild(imgCont);
    cont.appendChild(itemCont);
  });
}
