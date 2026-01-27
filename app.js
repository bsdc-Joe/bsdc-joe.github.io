const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".portal-content");

if (tabButtons.length) {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      button.classList.add("active");
      const target = document.getElementById(button.dataset.tab);
      if (target) {
        target.classList.add("active");
      }
    });
  });
}

const faqButtons = document.querySelectorAll(".faq-item");
faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const panel = button.nextElementSibling;
    const expanded = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!expanded));
    if (panel) {
      panel.classList.toggle("open", !expanded);
    }
  });
});
