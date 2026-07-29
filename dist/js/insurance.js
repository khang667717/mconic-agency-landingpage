(() => {
  // js/insurance.js
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
    document.querySelectorAll("[data-tier]").forEach((b) => {
      b.addEventListener("click", () => {
        document.querySelector(".ins-hero").scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => document.getElementById("qName").focus(), 500);
      });
    });
    const INSURANCE_TIERS = [
      { min: 0, max: 17, fee: null, tier: "Ch\u01B0a \u0111\u1EE7 tu\u1ED5i tham gia", color: "#E65100" },
      { min: 18, max: 30, fee: "500.000", tier: "Th\u1EBB B\u1EA1c", color: "#9E9E9E", cardClass: "tier-silver", features: ["B\u1EA3o v\u1EC7 y t\u1EBF n\u1ED9i tr\xFA c\u01A1 b\u1EA3n", "\u0110\u1EC1n b\xF9 tai n\u1EA1n l\xEAn \u0111\u1EBFn 50 tri\u1EC7u", "H\u1ED7 tr\u1EE3 chi ph\xED n\u1EB1m vi\u1EC7n c\xF4ng", "H\u1ED7 tr\u1EE3 kh\u1EA9n c\u1EA5p 24/7"] },
      { min: 31, max: 40, fee: "800.000", tier: "Th\u1EBB Titan", color: "#546E7A", cardClass: "tier-titan", features: ["B\u1EA3o v\u1EC7 y t\u1EBF n\u1ED9i & ngo\u1EA1i tr\xFA c\u01A1 b\u1EA3n", "\u0110\u1EC1n b\xF9 tai n\u1EA1n l\xEAn \u0111\u1EBFn 150 tri\u1EC7u", "H\u1ED7 tr\u1EE3 n\u1EB1m vi\u1EC7n t\u1EA1i b\u1EC7nh vi\u1EC7n t\u01B0 (n\u1ED9i tr\xFA)", "B\u1EA3o l\xE3nh vi\u1EC7n ph\xED nhanh 24/7"] },
      { min: 41, max: 50, fee: "1.200.000", tier: "Th\u1EBB V\xE0ng", color: "#F9A825", cardClass: "tier-gold", features: ["B\u1EA3o v\u1EC7 y t\u1EBF n\u1ED9i & ngo\u1EA1i tr\xFA to\xE0n di\u1EC7n", "\u0110\u1EC1n b\xF9 tai n\u1EA1n l\xEAn \u0111\u1EBFn 400 tri\u1EC7u", "H\u1ED7 tr\u1EE3 n\u1EB1m vi\u1EC7n ph\xF2ng ti\xEAu chu\u1EA9n ri\xEAng", "B\u1EA3o l\xE3nh vi\u1EC7n ph\xED b\u1EC7nh vi\u1EC7n qu\u1ED1c t\u1EBF"] },
      { min: 51, max: 60, fee: "1.800.000", tier: "Th\u1EBB B\u1EA1ch Kim", color: "#90A4AE", cardClass: "tier-platinum", features: ["Quy\u1EC1n l\u1EE3i y t\u1EBF VIP to\xE0n qu\u1ED1c", "\u0110\u1EC1n b\xF9 tai n\u1EA1n l\xEAn \u0111\u1EBFn 800 tri\u1EC7u", "N\u1EB1m vi\u1EC7n ph\xF2ng Suite cao c\u1EA5p t\u1EF1 ch\u1ECDn", "H\u1ED7 tr\u1EE3 kh\u1EA9n c\u1EA5p v\xE0 b\u1EA3o l\xE3nh vi\u1EC7n ph\xED VIP 24/7"] },
      { min: 61, max: 75, fee: "3.000.000", tier: "Th\u1EBB Kim C\u01B0\u01A1ng", color: "#1565C0", cardClass: "tier-diamond", features: ["B\u1EA3o hi\u1EC3m y t\u1EBF to\xE0n c\u1EA7u VIP", "\u0110\u1EC1n b\xF9 tai n\u1EA1n l\xEAn \u0111\u1EBFn 2 T\u1EF7 \u0111\u1ED3ng", "H\u1ED7 tr\u1EE3 chi ph\xED \u0111i\u1EC1u tr\u1ECB t\u1EA1i n\u01B0\u1EDBc ngo\xE0i", "D\u1ECBch v\u1EE5 b\xE1c s\u0129 gia \u0111\xECnh & v\u1EADn chuy\u1EC3n c\u1EA5p c\u1EE9u qu\u1ED1c t\u1EBF"] },
      { min: 76, max: 999, fee: null, tier: "Kh\xF4ng \u0111\u1EE7 \u0111i\u1EC1u ki\u1EC7n tham gia (T\u1ED1i \u0111a 75 tu\u1ED5i)", color: "#D32F2F" }
    ];
    const form = document.getElementById("quoteForm");
    const result = document.getElementById("quoteResult");
    const allCards = document.querySelectorAll(".tier");
    const tiersGrid = document.querySelector(".tiers-grid");
    const showAllBtnContainer = document.getElementById("show-all-tiers-container");
    const esc = (s) => s.replace(/[&<>]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[m]);
    function resetTierCards() {
      allCards.forEach((card) => {
        card.classList.remove("tier-hidden", "tier--recommended", "tier--disabled");
      });
      if (tiersGrid) {
        tiersGrid.classList.remove("tiers-grid--filtered");
      }
      if (showAllBtnContainer) {
        showAllBtnContainer.style.display = "none";
      }
    }
    function clearQuoteResult() {
      result.innerHTML = "";
      result.classList.remove("show");
      result.style.display = "none";
    }
    ["qName", "qPhone", "qAge"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", () => {
          const errEl = document.getElementById(id + "Err");
          if (errEl) errEl.textContent = "";
        });
      }
    });
    function validateForm() {
      let valid = true;
      const name = document.getElementById("qName").value.trim();
      const phoneRaw = document.getElementById("qPhone").value.trim();
      const ageVal = document.getElementById("qAge").value;
      const age = parseInt(ageVal);
      const phone = phoneRaw.replace(/[\s.-]/g, "");
      document.getElementById("qNameErr").textContent = "";
      document.getElementById("qPhoneErr").textContent = "";
      document.getElementById("qAgeErr").textContent = "";
      if (!name) {
        document.getElementById("qNameErr").textContent = "Vui l\xF2ng nh\u1EADp h\u1ECD t\xEAn.";
        valid = false;
      }
      if (!/^0[0-9]{9}$/.test(phone)) {
        document.getElementById("qPhoneErr").textContent = "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i ph\u1EA3i \u0111\u1EE7 10 s\u1ED1 v\xE0 b\u1EAFt \u0111\u1EA7u b\u1EB1ng 0.";
        valid = false;
      }
      if (isNaN(age) || age < 0 || age > 120) {
        document.getElementById("qAgeErr").textContent = "Tu\u1ED5i ph\u1EA3i l\xE0 s\u1ED1 nguy\xEAn t\u1EEB 0 \u0111\u1EBFn 120.";
        valid = false;
      }
      return valid ? { name, phone, age } : null;
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = validateForm();
      if (!data) return;
      const age = data.age;
      const tier = INSURANCE_TIERS.find((t) => age >= t.min && age <= t.max);
      fetch("/api/leads/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          age: data.age,
          recommendedTier: tier ? tier.tier : "N/A"
        })
      }).catch((err) => {
        console.error("Failed to submit quote lead:", err);
      });
      resetTierCards();
      if (tier && tier.fee) {
        result.style.display = "none";
        result.classList.remove("show");
        allCards.forEach((card) => {
          if (card.classList.contains(tier.cardClass)) {
            card.classList.add("tier--recommended");
          } else {
            card.classList.add("tier-hidden");
          }
        });
        if (tiersGrid) {
          tiersGrid.classList.add("tiers-grid--filtered");
        }
        if (showAllBtnContainer) {
          showAllBtnContainer.style.display = "block";
        }
      } else {
        result.innerHTML = `
        <div class="result__top">Xin ch\xE0o, <strong>${esc(data.name)}</strong>!</div>
        <div class="result__rec">
          <p style="margin: 0; color: #111;">Tu\u1ED5i c\u1EE7a b\u1EA1n: <strong>${age} tu\u1ED5i</strong></p>
          <div style="color: ${tier ? tier.color : "#D32F2F"}; font-weight: 700; font-size: 1.05rem; margin-top: 0.75rem; padding: 0.75rem; background: rgba(211, 47, 47, 0.05); border-left: 4px solid ${tier ? tier.color : "#D32F2F"}; border-radius: 8px;">
            ${tier ? tier.tier : "Kh\xF4ng \u0111\u1EE7 \u0111i\u1EC1u ki\u1EC7n tham gia"}
          </div>
        </div>
      `;
        result.classList.add("show");
        result.style.display = "block";
        allCards.forEach((card) => {
          card.classList.add("tier--disabled");
        });
      }
      setTimeout(() => {
        const tiersSection = document.getElementById("tiers");
        if (tiersSection) {
          tiersSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 400);
    });
    form.addEventListener("reset", () => {
      document.querySelectorAll(".field-error").forEach((err) => {
        err.textContent = "";
      });
      clearQuoteResult();
      resetTierCards();
    });
    const btnShowAllTiers = document.getElementById("btn-show-all-tiers");
    if (btnShowAllTiers) {
      btnShowAllTiers.addEventListener("click", () => {
        allCards.forEach((card) => {
          card.classList.remove("tier-hidden");
        });
        const grid = document.querySelector(".tiers-grid");
        if (grid) grid.classList.remove("tiers-grid--filtered");
        if (showAllBtnContainer) showAllBtnContainer.style.display = "none";
      });
    }
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
//# sourceMappingURL=insurance.js.map
