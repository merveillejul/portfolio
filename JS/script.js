/* ============================================================
   SCRIPT.JS — Portfolio Merveille J. Nourryssou-Opou
   BTS SIO SLAM — 2026
   
   Fonctionnalités :
   1. Navbar — effet scroll + classe active
   2. Burger menu mobile
   3. Active link tracking (scroll spy)
   4. Skill filter (par catégorie)
   5. Contact form EmailJS
   6. Toast notifications
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================================
     1. NAVBAR — EFFET SCROLL
     Ajoute .scrolled pour déclencher box-shadow en CSS
  ========================================================== */
  const navbar = document.querySelector(".navbar");

  const handleNavbarScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };

  window.addEventListener("scroll", handleNavbarScroll, { passive: true });


  /* ==========================================================
     2. BURGER MENU MOBILE
     Toggle .open sur burger + drawer
  ========================================================== */
  const burger      = document.getElementById("burger");
  const mobileDrawer = document.getElementById("mobile-drawer");

  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    mobileDrawer.classList.toggle("open");
    // Accessibilité
    const isOpen = burger.classList.contains("open");
    burger.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Fermer le drawer au clic sur un lien
  mobileDrawer.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      burger.classList.remove("open");
      mobileDrawer.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  // Fermer au clic en dehors
  document.addEventListener("click", e => {
    if (!mobileDrawer.contains(e.target) && !burger.contains(e.target)) {
      burger.classList.remove("open");
      mobileDrawer.classList.remove("open");
      document.body.style.overflow = "";
    }
  });


  /* ==========================================================
     3. SCROLL SPY — ACTIVE LINK TRACKING
     Met à jour les liens actifs dans la navbar en fonction
     de la section visible.
  ========================================================== */
  const sections  = document.querySelectorAll("section[id]");
  const navLinks  = document.querySelectorAll(".nav-links a");

  const activateNavLink = () => {
    let currentId = "";
    const scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute("href").replace("#", "");
      link.classList.toggle("active", href === currentId);
    });
  };

  window.addEventListener("scroll", activateNavLink, { passive: true });
  activateNavLink(); // au chargement


  /* ==========================================================
     4. FILTRES COMPÉTENCES
     Masque / affiche les cartes selon la catégorie sélectionnée.
     Animation CSS keyframe relancée via re-clone de l'élément.
  ========================================================== */
  const filterBtns  = document.querySelectorAll(".sf-btn");
  const skillCards  = document.querySelectorAll(".skill-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Activer le bouton cliqué
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      skillCards.forEach(card => {
        const cat = card.dataset.cat;
        const visible = (filter === "all") || (cat === filter);

        if (visible) {
          card.style.display = "flex";
          // Relancer l'animation d'entrée
          card.style.animation = "none";
          card.offsetHeight; // reflow
          card.style.animation = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  });


  /* ==========================================================
     5. EMAILJS — FORMULAIRE DE CONTACT
     Initialisation + envoi + feedback utilisateur
  ========================================================== */
  if (typeof emailjs !== "undefined") {
    emailjs.init("CXvNLb2hdokdzqiv_");
  }

  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", async e => {
      e.preventDefault();

      // Anti-spam honeypot
      if (contactForm.website.value) return;

      const submitBtn = contactForm.querySelector("button[type=submit]");
      const originalText = submitBtn.innerHTML;

      // État : envoi en cours
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours…`;
      showToast("Envoi en cours…", "");

      try {
        await emailjs.sendForm(
          "service_2ltrxkh",
          "template_ogtux7d",
          contactForm
        );
        showToast("✔ Message envoyé avec succès !", "success");
        contactForm.reset();
      } catch (error) {
        console.error("EmailJS error:", error);
        showToast("❌ Une erreur est survenue. Réessayez.", "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }


  /* ==========================================================
     6. TOAST NOTIFICATION
     Affiche un message temporaire en bas à droite.
     Types : "" (neutre) | "success" | "error"
  ========================================================== */
  const toast = document.getElementById("toast");
  let toastTimer = null;

  function showToast(message, type = "") {
    if (!toast) return;

    toast.textContent = message;
    toast.className = "show";
    if (type) toast.classList.add(type);

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.className = "";
    }, 4000);
  }


  /* ==========================================================
     7. ANIMATIONS D'APPARITION AU SCROLL
     Intersection Observer — déclenche fadeUp CSS sur les cartes
     lorsqu'elles entrent dans le viewport.
     Alternative légère à AOS — aucune dépendance externe.
  ========================================================== */
  const animTargets = document.querySelectorAll(
    ".tl-card, .formation-card, .skill-card, .project-card, " +
    ".exp-card, .veille-card, .vi-block, .contact-item"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "fadeUp 0.5s ease both";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  animTargets.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.animationDelay = `${(i % 6) * 0.07}s`;
    observer.observe(el);
  });

}); // end DOMContentLoaded