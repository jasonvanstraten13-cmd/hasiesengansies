document.documentElement.classList.remove("no-js");

// Header shrinks once the visitor scrolls down
const header = document.querySelector("[data-header]");
const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 24);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Mobile menu
const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
if (toggle && nav) {
  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  };
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
}

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
}

// Footer year
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

// Contact form (Formspark)
const form = document.getElementById("contactForm");
if (form) {
  form.querySelector('[name="_redirect"]').value = new URL("thank-you.html", window.location.href).href;
  const note = document.getElementById("formNote");
  form.addEventListener("submit", (e) => {
    let firstInvalid = null;
    form.querySelectorAll("[required]").forEach((field) => {
      const ok = field.checkValidity();
      field.setAttribute("aria-invalid", String(!ok));
      if (!ok && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      e.preventDefault();
      note.textContent = "Please fill in the highlighted fields so we can get back to you.";
      firstInvalid.focus();
      return;
    }
    const phone = form.querySelector("#phone").value.replace(/\D/g, "");
    form.querySelector("#whatsapp").value = phone ? "https://wa.me/" + phone.replace(/^0/, "27") : "";
    note.textContent = "Sending…";
  });
}
