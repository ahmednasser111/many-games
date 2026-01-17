var flipAllowed = true;
var flippedCard = undefined;
var images = [
  "https://wallpapercave.com/wp/wp9583413.jpg",
  "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/12/gojo-win.jpg?q=49&fit=crop&w=528&h=374&dpr=2",
];
let elapsedTime = document.getElementById("elapsed-time");
let timeLeft = document.getElementById("time-left");
let timeLimitSeconds = 30;
var used = [];
document.getElementById("start").addEventListener("click", () => {
  buildGrid(5);
});
buildGrid(2);

function buildInfo() {
  if (timeLimitSeconds == 0) {
    // TODO remove time left when there's no time limit
  }
}

function buildGrid(size) {
  buildInfo();
  let totalSpace = Math.min(window.innerHeight - 80, window.innerWidth);
  let availSpace = totalSpace - (size + 1) * 10;
  let cardSize = availSpace / size;
  let grid = document.getElementById("game-grid");
  grid.style.width = totalSpace + "px";
  grid.style.height = totalSpace + "px";
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  for (let i = 0; i < size * size; i++) {
    grid.appendChild(buildCard(cardSize, getRandomImg()));
  }
  document.getElementById("pre-game").classList.add("playing");
  document.getElementById("game-play-ui").classList.add("playing");
  grid.scrollIntoView({ behavior: "smooth" });
}

function buildCard(cardSize, imgUrl) {
  let card = document.createElement("div");
  card.classList.add("card");
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

function flipCard(card) {
  if (!flipAllowed) {
    return;
  }
  if (!card.classList.contains("flipped")) {
    card.classList.add("flipped");
    if (flippedCard == undefined) {
      flippedCard = card;
    } else {
      flipAllowed = false;
      setTimeout(() => {
        if (getCardImg(flippedCard) == getCardImg(card)) {
          flippedCard.classList.add("right");
          card.classList.add("right");
        } else {
          flippedCard.classList.remove("flipped");
          card.classList.remove("flipped");
        }
        flippedCard = undefined;
        flipAllowed = true;
      }, 1000);
    }
  }
}

function getRandomImg() {
  let random = Math.round(Math.random() * (images.length - 1));
  let img = images[random];
  if (used.includes(img)) {
    images = images.slice(0, random).concat(images.slice(random + 1));
  } else {
    used.push(img);
  }
  return img;
}

function getCardImg(card) {
  return card.getElementsByTagName("img")[0].src;
}
