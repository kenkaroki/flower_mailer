const garden = document.getElementById("garden");
const card = document.getElementById("card");

/* =========================
   🌸 FLOWER COUNT (adaptive)
========================= */
function getFlowerCount() {
  const area = window.innerWidth * window.innerHeight;
  const densityFactor = 18000;

  let count = Math.floor(area / densityFactor);
  return Math.max(70, Math.min(250, count));
}

const FLOWER_COUNT = getFlowerCount();

/* =========================
   🌸 SAFE GRID SPACING
========================= */
const MIN_SPACING = 70;

const cols = Math.floor(window.innerWidth / MIN_SPACING);
const rows = Math.floor(window.innerHeight / MIN_SPACING);

const cellW = window.innerWidth / cols;
const cellH = window.innerHeight / rows;

let created = 0;

/* =========================
   🌸 CREATE FLOWERS
========================= */
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    if (created >= FLOWER_COUNT) break;

    const flower = document.createElement("div");
    flower.classList.add("flower");

    const size = Math.random() * 25 + 20;
    flower.style.width = size + "px";
    flower.style.height = size + "px";

    const x = c * cellW + Math.random() * (cellW * 0.4);
    const y = r * cellH + Math.random() * (cellH * 0.4);

    flower.style.left = `${x}px`;
    flower.style.top = `${y}px`;

    const stem = document.createElement("span");
    stem.classList.add("stem");

    const stemHeight = Math.random() * 50 + 40;
    stem.style.setProperty("--stem-height", stemHeight + "px");

    flower.appendChild(stem);
    garden.appendChild(flower);

    flower.dataset.windFactor = Math.random() * 1.5 + 0.5;
    flower.dataset.phase = Math.random() * Math.PI * 2;

    created++;
  }
}

const flowers = document.querySelectorAll(".flower");

/* =========================
   🌬️ CINEMATIC WIND + STRENGTH
========================= */
let gust = 0;
let gustTarget = 0;

setInterval(() => {
  gustTarget = Math.random();
}, 5000);

function animateWind(t) {
  const time = t * 0.0005;

  gust += (gustTarget - gust) * 0.01;

  // 🌬️ compute global wind strength for glow
  let avgWind = 0;

  flowers.forEach((flower) => {
    const factor = parseFloat(flower.dataset.windFactor);
    const phase = parseFloat(flower.dataset.phase);

    const wave = Math.sin(time + parseFloat(flower.style.top) * 0.01) * 10;
    const gustForce = gust * 25 * factor;
    const flutter = Math.sin(t * 0.002 + phase) * 1.5;

    const windX = wave + gustForce + flutter;
    const windY = Math.cos(time + phase) * 2 * gust;

    flower.style.transform = `translate(${windX}px, ${windY}px)`;

    avgWind += Math.abs(gustForce) * 0.01;
  });

  // 🌬️ update CSS wind strength variable (for card glow)
  document.documentElement.style.setProperty(
    "--wind-strength",
    Math.min(avgWind / FLOWER_COUNT, 1),
  );

  requestAnimationFrame(animateWind);
}

requestAnimationFrame(animateWind);

/* =========================
   🌸 BLOOM + CARD
========================= */
function startAnimation() {
  const flowers = document.querySelectorAll(".flower");

  setTimeout(() => {
    flowers.forEach((flower) => {
      setTimeout(() => {
        flower.classList.add("bloom");
      }, Math.random() * 1000);
    });

    setTimeout(() => {
      card.classList.add("show");
    }, 4500);
  }, 1000);
}

window.addEventListener("load", startAnimation);
