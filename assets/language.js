"use strict";

// All six pages have ordinary links. Add the current reading position when a language is chosen.
const languageMenu = document.querySelector(".languages");
const languageLinks = languageMenu.querySelectorAll("a");
const readingSections = document.querySelectorAll("main section[id], footer[id]");

function linkToCurrentSection() {
  const top = document.querySelector("header").getBoundingClientRect().bottom + 24;
  let id = "";
  for (const section of readingSections) {
    if (section.getBoundingClientRect().top <= top) id = section.id;
  }
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    id = readingSections[readingSections.length - 1].id;
  }
  // A direct section link can settle lower in the viewport while fonts or images load.
  const target = document.getElementById(window.location.hash.slice(1));
  if (target) {
    const bounds = target.getBoundingClientRect();
    if (bounds.bottom > top && bounds.top < window.innerHeight) id = target.id;
  } else if (window.scrollY < 8) {
    id = "";
  }
  for (const link of languageLinks) link.hash = id;
}

languageMenu.addEventListener("toggle", () => {
  if (languageMenu.open) linkToCurrentSection();
});
languageMenu.addEventListener("click", event => {
  if (event.target.closest("a")) {
    linkToCurrentSection();
    languageMenu.open = false;
    languageMenu.querySelector("summary").focus({ preventScroll: true });
  }
});
document.addEventListener("click", event => {
  if (!languageMenu.contains(event.target)) languageMenu.open = false;
});
languageMenu.addEventListener("keydown", event => {
  if (event.key === "Escape" && languageMenu.open) {
    event.stopPropagation();
    languageMenu.open = false;
    languageMenu.querySelector("summary").focus();
  }
});
