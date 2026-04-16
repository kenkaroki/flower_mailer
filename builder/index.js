const form = document.getElementById("form");
const formDiv = document.getElementById("form-div");
const successDiv = document.getElementById("succesive_div");
const urlText = document.getElementById("url");

function getHue(color) {
  const ctx = document.createElement("canvas").getContext("2d");

  ctx.fillStyle = color;
  const normalized = ctx.fillStyle;

  const temp = document.createElement("div");
  temp.style.color = normalized;
  document.body.appendChild(temp);

  const rgb = getComputedStyle(temp).color;
  document.body.removeChild(temp);

  const [r, g, b] = rgb.match(/\d+/g).map(Number);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  if (max === min) return 0;

  let hue;

  if (max === r) {
    hue = (g - b) / (max - min);
  } else if (max === g) {
    hue = 2 + (b - r) / (max - min);
  } else {
    hue = 4 + (r - g) / (max - min);
  }

  hue *= 60;

  if (hue < 0) hue += 360;

  return Math.round(hue);
}

function generateLink(formData) {
  const payload = {
    hue: getHue(formData.get("flower_color")),
    recipient: formData.get("recipient_name"),
    sender: formData.get("sender_name"),
    message: formData.get("message"),
  };

  const encoded = btoa(JSON.stringify(payload));

  return `${location.origin}/flower_messages/messages/?data=${encodeURIComponent(encoded)}`;
}

function share(url) {
  
  // Native share (best on mobile)
  document
    .getElementById("shareNativeBtn")
    .addEventListener("click", async () => {
      const link = url;

      if (navigator.share) {
        try {
          await navigator.share({
            title: "Flower Message 🌸",
            text: "I made you something special",
            url: link,
          });
        } catch (err) {
          console.log("Share cancelled");
        }
      } else {
        alert("Native share not supported on this browser.");
      }
    });
}



form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const link = generateLink(data);

  urlText.textContent = link;
  navigator.clipboard.writeText(link);
  share(link)

  formDiv.style.display = "none";
  successDiv.style.display = "flex";
});

const flowers = ["🌸", "🌺", "🌷", "🌼", "💮"];

function createFlower() {
  const flower = document.createElement("div");
  flower.classList.add("particle");

  // random flower emoji
  flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];

  // random horizontal position
  flower.style.left = Math.random() * 100 + "vw";

  // random size
  const size = Math.random() * 15 + 10;
  flower.style.fontSize = size + "px";

  // random speed
  const duration = Math.random() * 5 + 6;
  flower.style.animationDuration = duration + "s";

  document.body.appendChild(flower);

  // remove after animation ends
  setTimeout(() => {
    flower.remove();
  }, duration * 1000);
}

// continuous generation
setInterval(createFlower, 250);