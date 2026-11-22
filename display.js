import { db, departments, docId, todayKey, tokenText } from "./firebase-init.js";
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const board = document.getElementById("board");

const data = {
  G: { issued: 0, serving: 0 },
  L: { issued: 0, serving: 0 },
  P: { issued: 0, serving: 0 },
  D: { issued: 0, serving: 0 }
};

function render() {
  board.innerHTML = "";
  for (const code in departments) {
    const waiting = data[code].issued - data[code].serving;
    const row = document.createElement("div");
    row.className = "board-row";
    row.innerHTML =
      "<h2>" + departments[code] + "</h2>" +
      "<p class='token'>" + tokenText(code, data[code].serving) + "</p>" +
      "<p class='waiting'>Waiting: " + waiting + "</p>";
    board.appendChild(row);
  }
}

// live updates: the screen changes the moment staff click "Call next"
for (const code in departments) {
  onSnapshot(doc(db, "queue", docId(code)), function (snap) {
    data[code] = snap.exists() ? snap.data() : { issued: 0, serving: 0 };
    render();
  });
}
render();

// if this screen stays on past midnight, start the new day's queue
const openedOn = todayKey();
setInterval(function () {
  if (todayKey() !== openedOn) location.reload();
}, 60000);