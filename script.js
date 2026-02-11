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

  if (theme === "dark") {
    sun.style.display = "inline-grid";
    moon.style.display = "none";
  } else {
    sun.style.display = "none";
    moon.style.display = "inline-grid";
  }
}

const saved = localStorage.getItem("theme");
const prefersDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

setTheme(saved || (prefersDark ? "dark" : "dark"));

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

mobileMenu?.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    mobileMenu.classList.remove("show");
    mobileMenu.setAttribute("aria-hidden", "true");
  });
});

// ===== Sliding Nav Indicator (Apple style) =====
const navContainer = document.querySelector(".nav-links");
const navIndicator = document.querySelector(".nav-indicator");
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));

function updateNavIndicator() {
  if (!navContainer || !navIndicator) return;

  const active = navContainer.querySelector("a.active");
  if (!active) {
    navIndicator.style.opacity = "0";
    navIndicator.style.width = "0px";
    return;
  }

  const navRect = navContainer.getBoundingClientRect();
  const linkRect = active.getBoundingClientRect();

  const left = linkRect.left - navRect.left;
  const width = linkRect.width;

  navIndicator.style.opacity = "1";
  navIndicator.style.width = `${width}px`;
  navIndicator.style.transform = `translateX(${left}px)`;
}

function setActive(hash) {
  navLinks.forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === hash)
  );
  updateNavIndicator();
}

// ===== Section tracking (fixes missing About/Experience/Contact) =====
const sectionIds = ["about", "projects", "skills", "experience", "education", "contact"];
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

// 1) IntersectionObserver (more forgiving)
const obs = new IntersectionObserver(
  (entries) => {
    // choose the visible section closest to the top
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

    if (!visible) return;
    setActive(`#${visible.target.id}`);
  },
  {
    root: null,
    rootMargin: "-20% 0px -70% 0px", // softer than before
    threshold: [0, 0.01, 0.1, 0.2],
  }
);

sections.forEach((s) => obs.observe(s));

// 2) Fallback: on scroll, pick closest section to the header
function setActiveOnScrollFallback() {
  const header = document.querySelector(".header");
  const headerHeight = header ? header.offsetHeight : 64;

  const line = headerHeight + 12; // a point just under the sticky header

  let best = null;
  let bestDist = Infinity;

  for (const s of sections) {
    const top = s.getBoundingClientRect().top;
    const dist = Math.abs(top - line);

    if (dist < bestDist) {
      bestDist = dist;
      best = s;
    }
  }

  if (best) setActive(`#${best.id}`);
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    setActiveOnScrollFallback();
    ticking = false;
  });
}, { passive: true });

// Keep indicator correct on resize + initial load
window.addEventListener("resize", updateNavIndicator);
window.addEventListener("load", () => {
  // set initial active state
  setActiveOnScrollFallback();
  updateNavIndicator();
});

// ===== Contact form: open email client (no backend) =====
const form = document.getElementById("contactForm");

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = encodeURIComponent(data.get("name"));
  const email = encodeURIComponent(data.get("email"));
  const msg = encodeURIComponent(data.get("message"));

  const subject = encodeURIComponent(
    `Portfolio enquiry from ${decodeURIComponent(name)}`
  );
  const body = encodeURIComponent(
    `Name: ${decodeURIComponent(name)}\nEmail: ${decodeURIComponent(email)}\n\nMessage:\n${decodeURIComponent(msg)}`
  );

  const to = "you@example.com";
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
