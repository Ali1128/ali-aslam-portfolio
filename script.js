const CONTACT_DETAILS = {
  email: {
    label: "ali.email@example.com",
    href: "mailto:ali.email@example.com"
  },
  linkedin: {
    label: "linkedin.com/in/your-profile",
    href: "https://www.linkedin.com/in/your-profile"
  },
  github: {
    label: "github.com/Ali1128/ali-aslam-portfolio",
    href: "https://github.com/Ali1128/ali-aslam-portfolio"
  },
  imdb: {
    label: "IMDb profile placeholder",
    href: "https://www.imdb.com/name/your-id"
  },
  resumePdf: ""
};

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("is-open", !isOpen);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("is-open");
    }
  });
}

document.querySelectorAll("[data-current-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

document.querySelectorAll("[data-contact]").forEach((link) => {
  const key = link.getAttribute("data-contact");
  const detail = CONTACT_DETAILS[key];

  if (!detail) {
    return;
  }

  link.textContent = detail.label;
  link.setAttribute("href", detail.href);

  if (detail.href.startsWith("http")) {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  }
});

document.querySelectorAll("[data-resume-download]").forEach((link) => {
  if (CONTACT_DETAILS.resumePdf) {
    link.setAttribute("href", CONTACT_DETAILS.resumePdf);
    link.removeAttribute("aria-disabled");
    link.textContent = "Download PDF Resume";
  } else {
    link.classList.add("is-disabled");
    link.addEventListener("click", (event) => event.preventDefault());
  }
});

const path = window.location.pathname.split("/").pop() || "index.html";
const currentPage = path.replace(".html", "");
const isProjectDetail = window.location.pathname.includes("/projects/");
const navKey = isProjectDetail ? "projects" : currentPage === "index" ? "home" : currentPage;

document.querySelectorAll("[data-nav]").forEach((link) => {
  if (link.getAttribute("data-nav") === navKey) {
    link.setAttribute("aria-current", "page");
  }
});

const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (motionAllowed && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".project-card, .project-row, .capability-grid article, .mock-window").forEach((node) => {
    node.classList.add("reveal");
    observer.observe(node);
  });
}
