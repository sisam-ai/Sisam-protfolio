const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((card, index) => {
  card.style.transitionDelay = `${index * 100}ms`;
  revealObserver.observe(card);
});

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
}));

// Creative energy reaction challenge
const curseCard = document.querySelector(".game-curse");
const curseButton = document.querySelector("#curse-button");
const curseStatus = document.querySelector("#curse-status");
const curseBest = document.querySelector("#curse-best");
let curseState = "ready";
let chargeTimer;
let signalTime = 0;
let savedCurseBest = Number(localStorage.getItem("sisam-curse-best")) || 0;
if (curseBest && savedCurseBest) curseBest.textContent = `${savedCurseBest} ms`;

curseButton?.addEventListener("click", () => {
  if (curseState === "waiting") {
    clearTimeout(chargeTimer);
    curseState = "ready";
    curseCard.classList.remove("is-charging");
    curseCard.classList.add("is-miss");
    curseStatus.textContent = "Too soon! Wait for the signal.";
    curseButton.innerHTML = 'Try again <span>↻</span>';
    return;
  }
  if (curseState === "go") {
    const reaction = Math.max(1, Math.round(performance.now() - signalTime));
    curseState = "done";
    curseCard.classList.remove("is-go");
    curseStatus.textContent = `⚡ ${reaction} ms — nice reflexes!`;
    curseButton.innerHTML = 'Train again <span>↻</span>';
    if (!savedCurseBest || reaction < savedCurseBest) {
      savedCurseBest = reaction;
      localStorage.setItem("sisam-curse-best", String(reaction));
      curseBest.textContent = `${reaction} ms`;
      curseStatus.textContent = `⚡ New best: ${reaction} ms!`;
    }
    return;
  }

  curseState = "waiting";
  curseCard.classList.remove("is-miss", "is-go");
  curseCard.classList.add("is-charging");
  curseStatus.textContent = "Focus... release when the energy turns cyan.";
  curseButton.innerHTML = 'Charging... <span>✳</span>';
  chargeTimer = window.setTimeout(() => {
    if (curseState !== "waiting") return;
    curseState = "go";
    signalTime = performance.now();
    curseCard.classList.remove("is-charging");
    curseCard.classList.add("is-go");
    curseStatus.textContent = "NOW! Tap the button!";
    curseButton.innerHTML = 'STRIKE NOW! <span>⚡</span>';
  }, 1100 + Math.random() * 2200);
});

// Block mining score attack
const mineButton = document.querySelector("#mine-button");
const mineReset = document.querySelector("#mine-reset");
const mineScoreLabel = document.querySelector("#mine-score");
const mineBestLabel = document.querySelector("#mine-best");
const mineHealthBar = document.querySelector("#mine-health");
const mineArt = document.querySelector(".mine-art");
const mineHint = document.querySelector(".mine-hint");
const mineFace = document.querySelector("#mine-face");
const blockTypes = [
  { name: "grass", icon: "▦", hp: 4 },
  { name: "stone", icon: "⬚", hp: 5 },
  { name: "ore", icon: "◆", hp: 6 },
  { name: "crystal", icon: "✧", hp: 3 },
];
let mined = 0;
let bestMined = Number(localStorage.getItem("sisam-mine-best")) || 0;
let currentBlock = blockTypes[0];
let durability = currentBlock.hp;
let blockAnimating = false;
if (mineBestLabel) mineBestLabel.textContent = String(bestMined);

function paintDurability() {
  if (mineHealthBar) mineHealthBar.style.width = `${Math.max(0, durability / currentBlock.hp) * 100}%`;
}

function resetMiningRun() {
  mined = 0;
  currentBlock = blockTypes[0];
  durability = currentBlock.hp;
  blockAnimating = false;
  mineScoreLabel.textContent = "0";
  mineFace.textContent = currentBlock.icon;
  mineHint.textContent = "CLICK THE BLOCK!";
  mineArt.classList.remove("broken", "hit");
  mineButton.disabled = false;
  paintDurability();
}

mineButton?.addEventListener("click", () => {
  if (blockAnimating) return;
  durability -= 1;
  mineArt.classList.remove("hit");
  void mineArt.offsetWidth;
  mineArt.classList.add("hit");
  mineButton.classList.add("hit");
  window.setTimeout(() => mineButton.classList.remove("hit"), 90);
  paintDurability();

  if (durability > 0) return;
  blockAnimating = true;
  mined += 1;
  mineScoreLabel.textContent = String(mined);
  mineArt.classList.add("broken");
  mineHint.textContent = "BLOCK BROKEN! DROP COLLECTED";
  if (mined > bestMined) {
    bestMined = mined;
    localStorage.setItem("sisam-mine-best", String(bestMined));
    mineBestLabel.textContent = String(bestMined);
  }

  window.setTimeout(() => {
    currentBlock = blockTypes[Math.floor(Math.random() * blockTypes.length)];
    durability = currentBlock.hp;
    mineFace.textContent = currentBlock.icon;
    mineHint.textContent = `${currentBlock.name.toUpperCase()} BLOCK · MINE IT!`;
    mineArt.classList.remove("broken", "hit");
    blockAnimating = false;
    paintDurability();
  }, 350);
});
mineReset?.addEventListener("click", resetMiningRun);

const scene = document.querySelector(".scene");
if (scene && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 8;
    const y = (event.clientY / window.innerHeight - 0.5) * 6;
    scene.style.setProperty("--tilt-x", `${y}deg`);
    scene.style.setProperty("--tilt-y", `${x}deg`);
  }, { passive: true });
}
