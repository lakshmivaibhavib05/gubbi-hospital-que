import { db, auth, departments, docId, todayKey, tokenText } from "./firebase-init.js";
import { doc, onSnapshot, runTransaction } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const panel = document.getElementById("panel");
const message = document.getElementById("message");
const loginBox = document.getElementById("login-box");
const staffArea = document.getElementById("staff-area");
const loginError = document.getElementById("login-error");

const data = {
  G: { issued: 0, serving: 0 },
  L: { issued: 0, serving: 0 },
  P: { issued: 0, serving: 0 },
  D: { issued: 0, serving: 0 }
};
let listeners = [];

function render() {
  panel.innerHTML = "";
  for (const code in departments) {
    const waiting = data[code].issued - data[code].serving;
    const card = document.createElement("div");
    card.className = "dept";
    card.innerHTML =
      "<h2>" + departments[code] + "</h2>" +
      "<p class='small'>Now serving</p>" +
      "<p class='big'>" + tokenText(code, data[code].serving) + "</p>" +
      "<p class='small'>Waiting: " + waiting + "</p>" +
      "<button data-code='" + code + "'>Call next</button>";
    panel.appendChild(card);
  }
}

// live updates from the database
function startListening() {
  for (const code in departments) {
    const stop = onSnapshot(doc(db, "queue", docId(code)), function (snap) {
      data[code] = snap.exists() ? snap.data() : { issued: 0, serving: 0 };
      render();
    });
    listeners.push(stop);
  }
}
function stopListening() {
  listeners.forEach(function (stop) { stop(); });
  listeners = [];
}

// show the login box or the staff area, depending on who is signed in
onAuthStateChanged(auth, function (user) {
  if (user) {
    loginBox.hidden = true;
    staffArea.hidden = false;
    startListening();
  } else {
    loginBox.hidden = false;
    staffArea.hidden = true;
    stopListening();
  }
});

document.getElementById("login-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  loginError.textContent = "";
  try {
    await signInWithEmailAndPassword(
      auth,
      document.getElementById("email").value.trim(),
      document.getElementById("password").value
    );
  } catch (error) {
    console.error(error);
    loginError.textContent = "Wrong email or password.";
  }
});

document.getElementById("logout-btn").addEventListener("click", function () {
  signOut(auth);
});

// "Call next" button
panel.addEventListener("click", async function (event) {
  const code = event.target.dataset.code;
  if (!code) return;

  const ref = doc(db, "queue", docId(code));
  try {
    const called = await runTransaction(db, async function (t) {
      const snap = await t.get(ref);
      if (!snap.exists() || snap.data().serving >= snap.data().issued) return null;
      const next = snap.data().serving + 1;
      t.update(ref, { serving: next });
      return next;
    });
    message.textContent = called
      ? "Calling " + tokenText(code, called) + " (" + departments[code] + ")"
      : "No patients waiting in " + departments[code] + ".";
  } catch (error) {
    console.error(error);
    message.textContent = "Could not call next. Check your internet connection.";
  }
});

// if the page stays open past midnight, start the new day's queue
const openedOn = todayKey();
setInterval(function () {
  if (todayKey() !== openedOn) location.reload();
}, 60000);