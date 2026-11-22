const departments = { G: "General OPD", L: "Laboratory", P: "Pharmacy", D: "Dental" };

const panel = document.getElementById("panel");
const message = document.getElementById("message");

function today() {
  return new Date().toDateString();
}

function load(key) {
  const saved = JSON.parse(localStorage.getItem(key));
  if (saved && saved.date === today()) return saved;
  return { date: today(), counts: { G: 0, L: 0, P: 0, D: 0 } };
}

function tokenText(code, number) {
  return number === 0 ? "---" : code + "-" + String(number).padStart(3, "0");
}

function render() {
  const issued = load("tokenCounters");
  const serving = load("nowServing");
  panel.innerHTML = "";

  for (const code in departments) {
    const waiting = issued.counts[code] - serving.counts[code];
    const card = document.createElement("div");
    card.className = "dept";
    card.innerHTML =
      "<h2>" + departments[code] + "</h2>" +
      "<p class='small'>Now serving</p>" +
      "<p class='big'>" + tokenText(code, serving.counts[code]) + "</p>" +
      "<p class='small'>Waiting: " + waiting + "</p>" +
      "<button data-code='" + code + "'>Call next</button>";
    panel.appendChild(card);
  }
}

panel.addEventListener("click", function (event) {
  const code = event.target.dataset.code;
  if (!code) return;

  const issued = load("tokenCounters");
  const serving = load("nowServing");

  if (serving.counts[code] >= issued.counts[code]) {
    message.textContent = "No patients waiting in " + departments[code] + ".";
    return;
  }

  serving.counts[code] += 1;
  localStorage.setItem("nowServing", JSON.stringify(serving));
  message.textContent = "Calling " + tokenText(code, serving.counts[code]) + " (" + departments[code] + ")";
  render();
});

document.getElementById("reset-btn").addEventListener("click", function () {
  if (confirm("Reset all tokens for today?")) {
    localStorage.removeItem("tokenCounters");
    localStorage.removeItem("nowServing");
    message.textContent = "All tokens reset.";
    render();
  }
});

render();