// Enable JS styling
document.documentElement.classList.remove("no-js");

// ===== Theme Toggle =====
const root = document.documentElement;
const toggle = document.getElementById("themeToggle");
const sun = toggle.querySelector('[data-icon="sun"]');
const moon = toggle.querySelector('[data-icon="moon"]');

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  // Show the opposite icon (like your screenshot: a small icon on the right)
  if (theme === "dark") {
    sun.style.display = "inline-grid";
    moon.style.display = "none";
  } else {
    sun.style.display = "none";
    moon.style.display = "inline-grid";
  }
}

const saved = localStorage.getItem("theme");
const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(saved || (prefersDark ? "dark" : "dark")); // default dark (matches screenshots)

toggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") || "dark";
  setTheme(current === "dark" ? "light" : "dark");
});

// ===== Mobile Menu =====
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");

burger?.addEventListener("click", () => {
  mobileMenu.classList.toggle("show");
  const open = mobileMenu.classList.contains("show");
  mobileMenu.setAttribute("aria-hidden", String(!open));
});

mobileMenu?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    mobileMenu.classList.remove("show");
    mobileMenu.setAttribute("aria-hidden", "true");
  });
});

// ===== Active nav link on scroll =====
const sections = ["about","projects","skills","experience","education","contact"]
  .map(id => document.getElementById(id))
  .filter(Boolean);

const navLinks = Array.from(document.querySelectorAll(".nav-links a"));

function setActive(hash) {
  navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === hash));
}

const obs = new IntersectionObserver((entries) => {
  const visible = entries.filter(e => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if (!visible) return;
  setActive(`#${visible.target.id}`);
}, { rootMargin: "-30% 0px -60% 0px", threshold: [0.12, 0.25, 0.5] });

sections.forEach(s => obs.observe(s));

// ===== Contact form: open email client (no backend) =====
const form = document.getElementById("contactForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = encodeURIComponent(data.get("name"));
  const email = encodeURIComponent(data.get("email"));
  const msg = encodeURIComponent(data.get("message"));

  const subject = encodeURIComponent(`Portfolio enquiry from ${decodeURIComponent(name)}`);
  const body = encodeURIComponent(
    `Name: ${decodeURIComponent(name)}\nEmail: ${decodeURIComponent(email)}\n\nMessage:\n${decodeURIComponent(msg)}`
  );

  // Replace with YOUR email
  const to = "you@example.com";
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
