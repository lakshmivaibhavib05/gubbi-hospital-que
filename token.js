import { db, departments, docId, tokenText } from "./firebase-init.js";
import { doc, runTransaction } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("token-form");
const formSection = document.getElementById("form-section");
const tokenSection = document.getElementById("token-section");
const errorBox = document.getElementById("error");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const code = document.getElementById("department").value;

  if (name === "") {
    errorBox.textContent = "Please enter the patient name.";
    return;
  }
  if (phone !== "" && !/^[0-9]{10}$/.test(phone)) {
    errorBox.textContent = "Phone number must be exactly 10 digits.";
    return;
  }
  errorBox.textContent = "Getting your token...";

  try {
    // the database gives out the next number safely, even if many people click at once
    const ref = doc(db, "queue", docId(code));
    const number = await runTransaction(db, async function (t) {
      const snap = await t.get(ref);
      if (!snap.exists()) {
        t.set(ref, { issued: 1, serving: 0 });
        return 1;
      }
      const next = snap.data().issued + 1;
      t.update(ref, { issued: next });
      return next;
    });

    document.getElementById("slip-number").textContent = tokenText(code, number);
    document.getElementById("slip-name").textContent = name;
    document.getElementById("slip-dept").textContent = departments[code];
    document.getElementById("slip-time").textContent = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
    document.getElementById("slip-count").textContent = number;

    errorBox.textContent = "";
    formSection.hidden = true;
    tokenSection.hidden = false;
  } catch (error) {
    console.error(error);
    errorBox.textContent = "Could not get a token. Check your internet and try again.";
  }
});

document.getElementById("print-btn").addEventListener("click", function () {
  window.print();
});

document.getElementById("new-btn").addEventListener("click", function () {
  form.reset();
  tokenSection.hidden = true;
  formSection.hidden = false;
});