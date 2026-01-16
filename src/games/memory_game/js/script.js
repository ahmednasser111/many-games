function buildGrid(size) {
  let totalSpace = Math.min(window.innerHeight, window.innerWidth);
  let availSpace = totalSpace - (size + 1) * 10;
  let cardSize = availSpace / size;
  let grid = document.getElementById("game-grid");
  grid.style.width = totalSpace + "px";
  grid.style.height = totalSpace + "px";
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  for (let i = 0; i < size * size; i++) {
    grid.appendChild(
      buildCard(
        cardSize,
        "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/12/gojo-win.jpg?q=49&fit=crop&w=528&h=374&dpr=2"
      )
    );
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

  card.addEventListener("click", () => {
    card.classList.add("flipped");
  });

  return card;
}

document.getElementById("start").addEventListener("click", () => {
  buildGrid(5);
});

buildGrid(5);
