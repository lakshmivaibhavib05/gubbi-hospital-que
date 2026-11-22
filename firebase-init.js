import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const departments = { G: "General OPD", L: "Laboratory", P: "Pharmacy", D: "Dental" };

// today's date like 2026-11-22 (each day starts a fresh queue)
export function todayKey() {
  return new Date().toLocaleDateString("en-CA");
}
export function docId(code) {
  return todayKey() + "_" + code;
}
export function tokenText(code, number) {
  return number === 0 ? "---" : code + "-" + String(number).padStart(3, "0");
}