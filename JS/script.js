/* ============================================================
   SCRIPT.JS — Portfolio Merveille J. Nourryssou-Opou
   BTS SIO SLAM — 2026
   Compatible : Chrome, Firefox, Safari iOS/macOS
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
      burger.setAttribute("aria-expanded", String(isOpen));
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


  /* 4. FILTRES COMPÉTENCES */
  const filterBtns = document.querySelectorAll(".sf-btn");
  const skillCards = document.querySelectorAll(".skill-card");

  if (filterBtns.length && skillCards.length) {
    const applyFilter = (filter) => {
      skillCards.forEach((card, index) => {
        const isVisible = filter === "all" || card.dataset.cat === filter;
        if (isVisible) {
          card.style.display = "flex";
          card.style.animation = "none";
          card.offsetHeight; // force reflow
          card.style.animation = "skillAppear 0.4s ease " + (index % 8) * 0.05 + "s both";
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


  /* 5. EMAILJS */
  if (typeof emailjs !== "undefined") emailjs.init("CXvNLb2hdokdzqiv_");

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();
      var honeypot = contactForm.querySelector('[name="website"]');
      if (honeypot && honeypot.value) return;

      var submitBtn = contactForm.querySelector("button[type=submit]");
      var originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>&nbsp; Envoi en cours…';
      showToast("Envoi en cours…");

      emailjs.sendForm("service_2ltrxkh", "template_ogtux7d", contactForm)
        .then(function() {
          showToast("✔ Message envoyé avec succès !", "success");
          contactForm.reset();
        })
        .catch(function(err) {
          console.error("EmailJS:", err);
          showToast("❌ Une erreur est survenue. Réessayez.", "error");
        })
        .finally(function() {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
        });
    });
  }


  /* 6. TOAST */
  var toast = document.getElementById("toast");
  var toastTimer = null;

  function showToast(message, type) {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.className = "show";
    if (type) toast.classList.add(type);
    toastTimer = setTimeout(function() { toast.className = ""; }, 4000);
  }
  window.showToast = showToast;


  /* 7. MODE SOMBRE — Safari compatible
     localStorage peut être bloqué en mode privé sur Safari.
     On utilise un try/catch pour éviter tout crash.
  */
  var themeToggle = document.getElementById("theme-toggle");
  var themeIcon   = document.getElementById("theme-icon");
  var themeLabel  = document.getElementById("theme-label");

  // Lire le thème sauvegardé — try/catch pour Safari privé
  var savedTheme = "light";
  try {
    savedTheme = localStorage.getItem("theme") || "light";
  } catch(e) {
    savedTheme = "light";
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark");
      if (themeIcon) {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
      }
      if (themeLabel) themeLabel.textContent = "Mode clair";
    } else {
      document.body.classList.remove("dark");
      if (themeIcon) {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
      }
      if (themeLabel) themeLabel.textContent = "Mode sombre";
    }
  }

  // Appliquer immédiatement
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function() {
      var isDark = document.body.classList.contains("dark");
      var newTheme = isDark ? "light" : "dark";
      applyTheme(newTheme);
      try {
        localStorage.setItem("theme", newTheme);
      } catch(e) {
        // Safari mode privé : on continue sans sauvegarder
      }
    });
  }


  /* 8. BOUTON RETOUR EN HAUT
     Safari fix : on utilise opacity + visibility au lieu de transform
     car position:fixed + transform pose problème sur iOS Safari
  */
  var backToTop = document.getElementById("back-to-top");

  if (backToTop) {
    var scrollHandler = function() {
      if (window.scrollY > 400) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });

    // Vérifier au chargement aussi
    scrollHandler();

    backToTop.addEventListener("click", function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }


  /* 9. ANIMATIONS AU SCROLL (Intersection Observer) */
  var animTargets = document.querySelectorAll(
    ".tl-card, .formation-card, .project-card, .exp-card, .veille-card, .vi-block, .contact-item"
  );

  if ("IntersectionObserver" in window) {
    var appearObserver = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            appearObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    animTargets.forEach(function(el) {
      el.classList.add("will-animate");
      appearObserver.observe(el);
    });
  } else {
    // Fallback Safari anciens : tout afficher directement
    animTargets.forEach(function(el) {
      el.classList.add("is-visible");
    });
  }

}); // end DOMContentLoaded