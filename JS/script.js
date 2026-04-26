/* ============================================================
   SCRIPT.JS — Portfolio Merveille J. Nourryssou-Opou
   BTS SIO SLAM — 2026
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* 1. NAVBAR — EFFET SCROLL */
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });


  /* 2. BURGER MENU MOBILE */
  const burger       = document.getElementById("burger");
  const mobileDrawer = document.getElementById("mobile-drawer");

  if (burger && mobileDrawer) {
    burger.addEventListener("click", () => {
      const isOpen = burger.classList.toggle("open");
      mobileDrawer.classList.toggle("open", isOpen);
      burger.setAttribute("aria-expanded", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    mobileDrawer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        burger.classList.remove("open");
        mobileDrawer.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
    document.addEventListener("click", e => {
      if (!mobileDrawer.contains(e.target) && !burger.contains(e.target)) {
        burger.classList.remove("open");
        mobileDrawer.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  }


  /* 3. SCROLL SPY */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const updateActiveLink = () => {
    let currentId = "";
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) currentId = section.getAttribute("id");
    });
    navLinks.forEach(link => {
      const href = link.getAttribute("href").replace("#", "");
      link.classList.toggle("active", href === currentId);
    });
  };
  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();


  /* 4. FILTRES COMPETENCES */
  const filterBtns = document.querySelectorAll(".sf-btn");
  const skillCards = document.querySelectorAll(".skill-card");

  if (filterBtns.length && skillCards.length) {
    const applyFilter = (filter) => {
      skillCards.forEach((card, index) => {
        const isVisible = filter === "all" || card.dataset.cat === filter;
        if (isVisible) {
          card.style.display = "flex";
          card.style.animation = "none";
          card.offsetHeight;
          card.style.animation = `skillAppear 0.4s ease ${(index % 8) * 0.05}s both`;
        } else {
          card.style.display = "none";
        }
      });
    };
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        applyFilter(btn.dataset.filter);
      });
    });
    applyFilter("all");
  }


  /* 5. EMAILJS — FORMULAIRE CONTACT */
  if (typeof emailjs !== "undefined") emailjs.init("CXvNLb2hdokdzqiv_");

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async e => {
      e.preventDefault();
      const honeypot = contactForm.querySelector('[name="website"]');
      if (honeypot && honeypot.value) return;

      const submitBtn = contactForm.querySelector("button[type=submit]");
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>&nbsp; Envoi en cours…`;
      showToast("Envoi en cours…");

      try {
        await emailjs.sendForm("service_2ltrxkh", "template_ogtux7d", contactForm);
        showToast("✔ Message envoyé avec succès !", "success");
        contactForm.reset();
      } catch (err) {
        console.error("EmailJS error:", err);
        showToast("❌ Une erreur est survenue. Réessayez.", "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    });
  }


  /* 6. TOAST NOTIFICATION */
  const toast = document.getElementById("toast");
  let toastTimer = null;

  function showToast(message, type = "") {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.className = "show";
    if (type) toast.classList.add(type);
    toastTimer = setTimeout(() => { toast.className = ""; }, 4000);
  }
  window.showToast = showToast;


  /* 7. MODE SOMBRE — Dark Mode */
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon   = document.getElementById("theme-icon");

  // Restaurer le thème sauvegardé
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    if (themeIcon) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    }
  }

  if (themeToggle && themeIcon) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark");
      if (isDark) {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
        localStorage.setItem("theme", "dark");
      } else {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
        localStorage.setItem("theme", "light");
      }
    });
  }


  /* 8. BOUTON RETOUR EN HAUT */
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("visible", window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }


  /* 9. ANIMATIONS AU SCROLL (Intersection Observer) */
  const animTargets = document.querySelectorAll(
    ".tl-card, .formation-card, .project-card, .exp-card, .veille-card, .vi-block, .contact-item"
  );
  const appearObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          appearObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
  );
  animTargets.forEach(el => {
    el.classList.add("will-animate");
    appearObserver.observe(el);
  });

}); // end DOMContentLoaded