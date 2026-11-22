const departments = { G: "General OPD", L: "Laboratory", P: "Pharmacy", D: "Dental" };

const board = document.getElementById("board");

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
  board.innerHTML = "";

  for (const code in departments) {
    const waiting = issued.counts[code] - serving.counts[code];
    const row = document.createElement("div");
    row.className = "board-row";
    row.innerHTML =
      "<h2>" + departments[code] + "</h2>" +
      "<p class='token'>" + tokenText(code, serving.counts[code]) + "</p>" +
      "<p class='waiting'>Waiting: " + waiting + "</p>";
    board.appendChild(row);
  }
}

render();

window.addEventListener("storage", render);
setInterval(render, 2000);