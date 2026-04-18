const garden = document.getElementById("garden");
const card = document.getElementById("card");

let flowers = [];

/* =========================
   🌸 URL VARIABLES
========================= */
function updateVariables() {
  const params = new URLSearchParams(location.search);
  const encoded = params.get("data");

  let hue = "330";
  let recipient = "Unknown";
  let sender = "Someone";
  let message = "No message provided";

  // 🔐 PRIORITY: encoded data
  if (encoded) {
    try {
      const decoded = JSON.parse(decodeURIComponent(escape(atob(encoded))));

      hue = decoded.hue ?? hue;
      recipient = decoded.recipient ?? recipient;
      sender = decoded.sender ?? sender;
      message = decoded.message ?? message;
    } catch (e) {
      console.error("Invalid encoded data:", e);
    }
  }

  // (optional fallback only if no data)
  else {
    hue = params.get("hue") || hue;
    recipient = params.get("recipient") || recipient;
    sender = params.get("sender") || sender;
    message = params.get("message") || message;
  }

  // UI update
  document.getElementById("recipient_name").innerText = recipient;
  document.getElementById("message").innerText = message;
  document.getElementById("sender").innerText = `— ${sender}`;

  document.documentElement.style.setProperty("--flower-hue", hue);
}

/* =========================
   🌸 FLOWER COUNT
========================= */
function getFlowerCount() {
  const area = window.innerWidth * window.innerHeight;
  const densityFactor = 18000;

  let count = Math.floor(area / densityFactor);
  return Math.max(70, Math.min(250, count));
}

const FLOWER_COUNT = getFlowerCount();

/* =========================
   🌸 GRID SETUP
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

    // store for animation (faster + safer)
    flower.dataset.top = y;

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

flowers = document.querySelectorAll(".flower");

/* =========================
   🌬️ WIND SYSTEM
========================= */
let gust = 0;
let gustTarget = 0;

setInterval(() => {
  gustTarget = Math.random();
}, 5000);

function animateWind(t) {
  const time = t * 0.0005;

  gust += (gustTarget - gust) * 0.01;

  let avgWind = 0;

  flowers.forEach((flower) => {
    const factor = parseFloat(flower.dataset.windFactor);
    const phase = parseFloat(flower.dataset.phase);
    const top = parseFloat(flower.dataset.top || 0);

    const wave = Math.sin(time + top * 0.01) * 10;
    const gustForce = gust * 25 * factor;
    const flutter = Math.sin(t * 0.002 + phase) * 1.5;

    const windX = wave + gustForce + flutter;
    const windY = Math.cos(time + phase) * 2 * gust;

    flower.style.transform = `translate(${windX}px, ${windY}px)`;

    avgWind += Math.abs(gustForce) * 0.01;
  });

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

/* =========================
   🚀 INIT
========================= */
window.addEventListener("load", () => {
  updateVariables();
  startAnimation();
});
