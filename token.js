// ---------- Department names (the letter is used in the token, e.g. G-001) ----------
const departments = {
  G: "General OPD",
  L: "Laboratory",
  P: "Pharmacy",
  D: "Dental"
};

// ---------- Grab the things on the page we need ----------
const form = document.getElementById("token-form");
const formSection = document.getElementById("form-section");
const tokenSection = document.getElementById("token-section");
const errorBox = document.getElementById("error");

// ---------- Token counters are saved in the browser, and reset every new day ----------
function todayString() {
  return new Date().toDateString();
}

function loadCounters() {
  const saved = JSON.parse(localStorage.getItem("tokenCounters"));
  if (saved && saved.date === todayString()) {
    return saved;
  }
  // new day (or first visit): start from zero
  return { date: todayString(), counts: { G: 0, L: 0, P: 0, D: 0 } };
}

function saveCounters(counters) {
  localStorage.setItem("tokenCounters", JSON.stringify(counters));
}

// ---------- When the form is submitted ----------
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const code = document.getElementById("department").value;

  // check the inputs
  if (name === "") {
    errorBox.textContent = "Please enter the patient name.";
    return;
  }
  if (phone !== "" && !/^[0-9]{10}$/.test(phone)) {
    errorBox.textContent = "Phone number must be exactly 10 digits.";
    return;
  }
  errorBox.textContent = "";

  // make the next token number for this department
  const counters = loadCounters();
  counters.counts[code] += 1;
  saveCounters(counters);

  const number = counters.counts[code];
  const tokenText = code + "-" + String(number).padStart(3, "0"); // e.g. G-007

  // fill the slip
  document.getElementById("slip-number").textContent = tokenText;
  document.getElementById("slip-name").textContent = name;
  document.getElementById("slip-dept").textContent = departments[code];
  document.getElementById("slip-time").textContent = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });
  document.getElementById("slip-count").textContent = number;

  // swap the form for the slip
  formSection.hidden = true;
  tokenSection.hidden = false;
});

// ---------- Buttons on the slip ----------
document.getElementById("print-btn").addEventListener("click", function () {
  window.print();
});

document.getElementById("new-btn").addEventListener("click", function () {
  form.reset();
  tokenSection.hidden = true;
  formSection.hidden = false;
});