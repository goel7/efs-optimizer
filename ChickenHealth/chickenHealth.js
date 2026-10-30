const button = document.getElementById("EnterBtn");
const levelElem = document.getElementById("chickenLevel");
const healthElem = document.getElementById("healthValue");
const resultsElem = document.getElementById("results");

// Accepts plain integers ("2000"), k/M suffixes ("2k", "1.5M") and e-notation ("2e3").
function parseLevel(input) {
  const text = input.trim().replace(/,/g, "");
  const suffixes = { k: 1e3, K: 1e3, m: 1e6, M: 1e6 };
  const suffix = text.match(/[kKmM]$/);
  const value = suffix
    ? parseFloat(text) * suffixes[suffix[0]]
    : Number(text);
  return Math.floor(value);
}

// log10(10^a + 10^b), so huge values never overflow a JS number.
function logAdd(a, b) {
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  return hi + Math.log10(1 + 10 ** (lo - hi));
}

// Returns log10(health) for a non-boss chicken at the given level.
function logHealth(level) {
  if (level <= 140) {
    return Math.log10(10 * (level - 1 + 1.55 ** (level - 1)));
  }
  if (level <= 500) {
    return Math.log10(
      10 * (139 + 2.8582883926875915e26 * 1.145 ** (level - 140))
    );
  }
  if (level <= 200000) {
    const n = Math.floor((level - 1) / 500);
    let result = Math.log10(4.227476956606746e48);
    for (let k = 1; k <= n; k++) {
      result += Math.min(500, level - 500 * k) * Math.log10(1.145 + 0.001 * k);
    }
    return result;
  }
  const bigTerm =
    Math.log10(1.24) + 25409 + (level - 200001) * Math.log10(1.545);
  return logAdd(bigTerm, Math.log10(10 * (level - 1)));
}

// Same "X.XXeN" style the BE Allocation page uses.
function formatHealth(logValue) {
  if (logValue < 6) {
    return Math.round(10 ** logValue).toLocaleString("en-US");
  }
  let power = Math.floor(logValue);
  let base = Number((10 ** (logValue - power)).toFixed(2));
  if (base >= 10) {
    base = 1;
    power += 1;
  }
  return `${base.toFixed(2)}e${power}`;
}

function updateHealth() {
  const level = parseLevel(levelElem.value);

  if (!Number.isFinite(level) || level < 1) {
    healthElem.textContent = "enter a level of 1 or more";
  } else {
    healthElem.textContent = formatHealth(logHealth(level));
  }

  resultsElem.style.visibility = "visible";
}

button.addEventListener("click", updateHealth);
levelElem.addEventListener("keyup", (e) => e.key === "Enter" && updateHealth());
