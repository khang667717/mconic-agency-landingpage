(() => {
  // js/script.js
  document.addEventListener("DOMContentLoaded", () => {
    const nav = document.getElementById("nav");
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    const burger = document.getElementById("burger");
    const panel = document.getElementById("navPanel");
    const overlay = document.getElementById("navOverlay");
    const closeBtn = document.getElementById("navClose");
    const openMenu = () => {
      panel.classList.add("open");
      overlay.classList.add("active");
      burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };
    const closeMenu = () => {
      panel.classList.remove("open");
      overlay.classList.remove("active");
      burger.setAttribute("aria-expanded", "false");
      setTimeout(() => {
        document.body.style.overflow = "";
      }, 300);
    };
    burger.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);
    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") {
          closeMenu();
          return;
        }
        if (href.startsWith("#")) {
          e.preventDefault();
          closeMenu();
          const target = document.querySelector(href);
          if (target) {
            setTimeout(() => {
              target.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 250);
          }
          return;
        }
        e.preventDefault();
        closeMenu();
        setTimeout(() => {
          window.location.href = href;
        }, 280);
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
    document.querySelectorAll('a[href^="#"]:not(.nav__panel a)').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id === "#" || id.length < 2) return;
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
    const qs = document.querySelectorAll(".faq__q");
    qs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") === "true";
        qs.forEach((b) => {
          b.setAttribute("aria-expanded", "false");
          b.nextElementSibling.style.maxHeight = null;
        });
        if (!open) {
          btn.setAttribute("aria-expanded", "true");
          const ans = btn.nextElementSibling;
          ans.style.maxHeight = ans.scrollHeight + "px";
        }
      });
    });
    const docModal = document.getElementById("docModal");
    const docModalForm = document.getElementById("docModalForm");
    const modalDocId = document.getElementById("modalDocId");
    const docModalClose = document.getElementById("docModalClose");
    const docModalOverlay = document.getElementById("docModalOverlay");
    let originalModalBodyHtml = "";
    if (docModal) {
      const modalBody = docModal.querySelector(".modal__body");
      if (modalBody) {
        originalModalBodyHtml = modalBody.innerHTML;
      }
    }
    const openDocModal = (docId) => {
      if (!docModal) return;
      const activeDocIdInput = document.getElementById("modalDocId");
      if (activeDocIdInput) {
        activeDocIdInput.value = docId;
      }
      docModal.classList.add("active");
      docModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    const closeDocModal = () => {
      if (!docModal) return;
      docModal.classList.remove("active");
      docModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      const modalBody = docModal.querySelector(".modal__body");
      if (modalBody && originalModalBodyHtml) {
        modalBody.innerHTML = originalModalBodyHtml;
        docModal.querySelector("#docModalClose").addEventListener("click", closeDocModal);
        bindDocForm();
      }
    };
    if (docModalClose) docModalClose.addEventListener("click", closeDocModal);
    if (docModalOverlay) docModalOverlay.addEventListener("click", closeDocModal);
    document.querySelectorAll("[data-doc]").forEach((b) => {
      b.addEventListener("click", () => {
        const doc = b.getAttribute("data-doc");
        openDocModal(doc);
      });
    });
    function bindDocForm() {
      const currentForm = document.getElementById("docModalForm");
      if (!currentForm) return;
      ["mName", "mEmail"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener("input", () => {
            const errEl = document.getElementById(id + "Err");
            if (errEl) errEl.textContent = "";
          });
        }
      });
      currentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("mName").value.trim();
        const email = document.getElementById("mEmail").value.trim();
        const docId = document.getElementById("modalDocId").value;
        document.getElementById("mNameErr").textContent = "";
        document.getElementById("mEmailErr").textContent = "";
        let ok = true;
        if (!name) {
          document.getElementById("mNameErr").textContent = "Vui l\xF2ng nh\u1EADp h\u1ECD v\xE0 t\xEAn.";
          ok = false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          document.getElementById("mEmailErr").textContent = "Email kh\xF4ng h\u1EE3p l\u1EC7.";
          ok = false;
        }
        if (!ok) return;
        const btn = currentForm.querySelector('button[type="submit"]');
        btn.classList.add("is-loading");
        btn.disabled = true;
        try {
          const response = await fetch("/api/leads/document", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, docId })
          });
          const result = await response.json();
          if (response.ok && result.success) {
            const modalBody = docModal.querySelector(".modal__body");
            modalBody.innerHTML = `
            <button class="modal__close" id="docModalClose" aria-label="\u0110\xF3ng"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
            <div style="text-align: center; padding: 2.2rem 1rem;">
              <div style="font-size: 4rem; color: var(--red); margin-bottom: 1.2rem; transform: scale(0); animation: popScale 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;"><i class="fa-solid fa-circle-check"></i></div>
              <h3 style="font-size: 1.6rem; text-transform: uppercase; margin-bottom: 0.6rem; font-family: var(--font-display); font-weight: 800;">G\u1EEDi t\xE0i li\u1EC7u th\xE0nh c\xF4ng!</h3>
              <p style="color: var(--ink-soft); font-size: 0.96rem; line-height: 1.6; margin-bottom: 1.8rem; font-family: var(--font-body);">
                Ch\xFAng t\xF4i \u0111\xE3 g\u1EEDi file t\xE0i li\u1EC7u v\xE0o h\u1ED9p th\u01B0 c\u1EE7a b\u1EA1n:<br>
                <strong style="color: var(--ink); word-break: break-all;">${email}</strong>.<br>
                Vui l\xF2ng ki\u1EC3m tra h\u1ED9p th\u01B0 \u0111\u1EBFn (ho\u1EB7c th\u01B0 r\xE1c/spam).
              </p>
              <button class="btn btn-red" id="successModalCloseBtn" style="width: 100%;">Ho\xE0n t\u1EA5t</button>
            </div>
            <style>
              @keyframes popScale { to { transform: scale(1); } }
            </style>
          `;
            modalBody.querySelector("#docModalClose").addEventListener("click", closeDocModal);
            modalBody.querySelector("#successModalCloseBtn").addEventListener("click", closeDocModal);
          } else {
            alert("L\u1ED7i: " + (result.message || "Kh\xF4ng th\u1EC3 g\u1EEDi y\xEAu c\u1EA7u t\xE0i li\u1EC7u."));
          }
        } catch (err) {
          console.error(err);
          alert("L\u1ED7i k\u1EBFt n\u1ED1i. Kh\xF4ng th\u1EC3 g\u1EEDi y\xEAu c\u1EA7u t\xE0i li\u1EC7u v\xE0o l\xFAc n\xE0y.");
        } finally {
          btn.classList.remove("is-loading");
          btn.disabled = false;
        }
      });
    }
    bindDocForm();
    const form = document.getElementById("contactForm");
    let originalFormHtml = "";
    if (form) {
      originalFormHtml = form.innerHTML;
    }
    function bindContactForm() {
      const currentForm = document.getElementById("contactForm");
      if (!currentForm) return;
      const clear = () => currentForm.querySelectorAll(".field-error").forEach((el) => el.textContent = "");
      ["cName", "cPhone", "cEmail"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener("input", () => {
            const errEl = document.getElementById(id + "Err");
            if (errEl) errEl.textContent = "";
          });
        }
      });
      currentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clear();
        const name = document.getElementById("cName").value.trim();
        const phoneRaw = document.getElementById("cPhone").value.trim();
        const email = document.getElementById("cEmail").value.trim();
        const phone = phoneRaw.replace(/[\s.-]/g, "");
        let ok = true;
        if (!name) {
          document.getElementById("cNameErr").textContent = "Vui l\xF2ng nh\u1EADp h\u1ECD v\xE0 t\xEAn.";
          ok = false;
        }
        if (!/^0[0-9]{9}$/.test(phone)) {
          document.getElementById("cPhoneErr").textContent = "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i ph\u1EA3i \u0111\u1EE7 10 s\u1ED1 v\xE0 b\u1EAFt \u0111\u1EA7u b\u1EB1ng 0.";
          ok = false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          document.getElementById("cEmailErr").textContent = "Email kh\xF4ng h\u1EE3p l\u1EC7.";
          ok = false;
        }
        if (!ok) return;
        const btn = currentForm.querySelector('button[type="submit"]');
        btn.classList.add("is-loading");
        btn.disabled = true;
        try {
          const response = await fetch("/api/leads/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, email })
          });
          const result = await response.json();
          if (response.ok && result.success) {
            currentForm.innerHTML = `
            <div style="text-align: center; padding: 2.5rem 1.2rem; background: var(--paper-2); border: 2px solid var(--ink); border-radius: var(--r-md); box-shadow: var(--shadow-pop);">
              <div style="font-size: 4.5rem; color: var(--red); margin-bottom: 1.2rem; transform: scale(0); animation: popScale 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;"><i class="fa-solid fa-circle-check"></i></div>
              <h3 style="font-size: 1.6rem; text-transform: uppercase; margin-bottom: 0.6rem; font-family: var(--font-display); font-weight: 800;">\u0110\u0103ng k\xFD th\xE0nh c\xF4ng!</h3>
              <p style="color: var(--ink-soft); font-size: 0.98rem; line-height: 1.6; margin-bottom: 1.8rem; font-family: var(--font-body);">
                C\u1EA3m \u01A1n b\u1EA1n, <strong>${name}</strong>!<br>
                Email x\xE1c nh\u1EADn \u0111\xE3 \u0111\u01B0\u1EE3c g\u1EEDi t\u1EDBi <strong>${email}</strong>.<br>
                Chuy\xEAn vi\xEAn ho\u1EA1ch \u0111\u1ECBnh s\u1EF1 ki\u1EC7n c\u1EE7a MCONIC s\u1EBD li\xEAn h\u1EC7 t\u01B0 v\u1EA5n qua s\u1ED1 \u0111i\u1EC7n tho\u1EA1i <strong>${phoneRaw}</strong> trong v\xF2ng 24h l\xE0m vi\u1EC7c.
              </p>
              <button class="btn btn-outline" id="resetContactFormBtn" style="width: 100%;">G\u1EEDi y\xEAu c\u1EA7u kh\xE1c</button>
            </div>
            <style>
              @keyframes popScale { to { transform: scale(1); } }
            </style>
          `;
            currentForm.querySelector("#resetContactFormBtn").addEventListener("click", () => {
              currentForm.innerHTML = originalFormHtml;
              bindContactForm();
            });
          } else {
            alert("L\u1ED7i: " + (result.message || "Kh\xF4ng th\u1EC3 g\u1EEDi y\xEAu c\u1EA7u t\u01B0 v\u1EA5n."));
          }
        } catch (err) {
          console.error(err);
          alert("L\u1ED7i k\u1EBFt n\u1ED1i. Vui l\xF2ng th\u1EED l\u1EA1i sau.");
        } finally {
          btn.classList.remove("is-loading");
          btn.disabled = false;
        }
      });
    }
    bindContactForm();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = document.querySelectorAll(".reveal");
    if (reduce || !("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("in"));
    } else {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            obs.unobserve(en.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      reveals.forEach((el) => io.observe(el));
    }
  });
})();
//# sourceMappingURL=main.js.map
