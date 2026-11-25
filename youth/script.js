"use strict";
// Yerel bölüm bağlantıları ve Academy bağlantısı JavaScript olmadan da çalışır.
const toggle = document.querySelector("#menu");
const menu = document.querySelector("#links");
function setMenu(open) {
  menu.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
}
toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
document.addEventListener("click", (event) => {
  if (event.target.closest("#links a") || !event.target.closest("header")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.classList.contains("open")) {
    setMenu(false);
    toggle.focus();
  }
});
matchMedia("(max-width: 850px)").addEventListener("change", () => setMenu(false));
document.documentElement.classList.add("js");
