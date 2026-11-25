"use strict";

// Bölüm bağlantıları normal HTML çapalarıdır. JavaScript mobil menüyü geliştirir.
const menu = document.querySelector("#menu");
const toggle = document.querySelector(".menu-toggle");
const links = [...menu.querySelectorAll('a[href^="#"]')];
const sections = links.map((link) => document.querySelector(link.hash));
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const mobile = matchMedia("(max-width: 940px)");

function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
  menu.classList.toggle("is-open", open);
}

toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    toggle.focus();
  }
});
menu.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
mobile.addEventListener("change", () => setMenu(false));
document.documentElement.classList.add("js");

// Sabit başlığın altında görülen bölümü menüde işaretle.
const header = document.querySelector(".site-header");
function updateCurrent() {
  const boundary = header.offsetHeight + 36;
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= boundary) current = section;
  }
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    current = sections[sections.length - 1];
  }
  for (const link of links) {
    if (link.hash === "#" + current.id) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}

let pendingScroll = false;
function scheduleUpdate() {
  if (pendingScroll) return;
  pendingScroll = true;
  requestAnimationFrame(() => {
    updateCurrent();
    pendingScroll = false;
  });
}
window.addEventListener("scroll", scheduleUpdate, { passive: true });
window.addEventListener("resize", scheduleUpdate);
updateCurrent();

// Son değer erişilebilir kalır. Sadece görsel sayı, görünüm alanına girince değişir.
const metrics = document.querySelector(".metrics");
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      const values = [...metrics.querySelectorAll("[data-count]")];
      for (const value of values) {
        const finalValue = document.createElement("span");
        finalValue.className = "sr-only";
        finalValue.textContent = value.textContent;
        value.before(finalValue);
        value.setAttribute("aria-hidden", "true");
      }
      const started = performance.now();
      function tick(now) {
        const progress = reducedMotion.matches ? 1 : Math.min(1, (now - started) / 750);
        values.forEach((value) => {
          value.textContent = String(Math.round(Number(value.dataset.count) * (1 - (1 - progress) ** 3)));
        });
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    },
    { threshold: 0.25 },
  );
  observer.observe(metrics);
}

// Bülten servisi tanımlı olmadığı için talep yalnızca kullanıcının tarayıcısında hazırlanır.
// Son gönderim kullanıcının e-posta uygulamasında yapılır.
const form = document.querySelector("#newsletter");
const email = document.querySelector("#email");
const panel = document.querySelector("#request-panel");
const requestText = document.querySelector("#request-text");
const status = document.querySelector("#status");
const mailLink = document.querySelector("#request-mail");
const mailBase = mailLink.href;
form.hidden = false;
form.addEventListener("submit", (event) => {
  event.preventDefault();
  requestText.value =
    "Merhaba, SÜGEP Academy e-bültenine abone olmak istiyorum. E-posta adresim: " + email.value.trim();
  mailLink.href = mailBase + "&body=" + encodeURIComponent(requestText.value);
  panel.hidden = false;
  status.textContent = "Talebiniz hazır. E-posta taslağını açıp gönderebilirsiniz.";
  requestText.focus();
});

email.addEventListener("input", () => {
  panel.hidden = true;
  mailLink.href = mailBase;
  requestText.value = "";
  status.textContent = "";
});

document.querySelector("#copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(requestText.value);
    status.textContent = "Mesaj kopyalandı. contact@sugepacademy.org adresine gönderebilirsiniz.";
  } catch {
    requestText.focus();
    requestText.select();
    status.textContent = "Mesaj seçildi. Cihazınızın kopyalama komutunu kullanabilirsiniz.";
  }
});
