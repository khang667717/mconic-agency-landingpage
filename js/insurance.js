/* ============================================================
   MCONIC Insurance — js/insurance.js
   = ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Nav scroll shadow ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 16);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile slide menu ---------- */
  const burger = document.getElementById('burger');
  const panel = document.getElementById('navPanel');
  const overlay = document.getElementById('navOverlay');
  const closeBtn = document.getElementById('navClose');

  const openMenu = () => {
    panel.classList.add('open');
    overlay.classList.add('active');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    panel.classList.remove('open');
    overlay.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    // Không reset overflow ngay lập tức (sẽ reset sau 300ms)
    setTimeout(() => {
      document.body.style.overflow = '';
    }, 300);
  };

  burger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // ========== QUAN TRỌNG: Xử lý link trên mobile menu ==========
  panel.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      // Bỏ qua nếu là link rỗng hoặc chỉ dấu #
      if (!href || href === '#') {
        closeMenu();
        return;
      }
      // Nếu là anchor trong cùng trang (bắt đầu bằng #)
      if (href.startsWith('#')) {
        e.preventDefault();
        closeMenu();
        const target = document.querySelector(href);
        if (target) {
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 250);
        }
        return;
      }
      // Với tất cả các link khác (sang trang khác hoặc external)
      e.preventDefault();
      closeMenu();
      // Chờ menu đóng xong (đủ thời gian animation) rồi mới chuyển trang
      setTimeout(() => {
        window.location.href = href;
      }, 280);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Smooth scroll (same-page anchors) ---------- */
  // Chỉ áp dụng cho anchor link trên desktop (không nằm trong panel)
  document.querySelectorAll('a[href^="#"]:not(.nav__panel a)').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Tier register buttons → focus form ---------- */
  document.querySelectorAll('[data-tier]').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelector('.ins-hero').scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => document.getElementById('qName').focus(), 500);
    });
  });

  /* ---------- Quote calculator ---------- */
  const INSURANCE_TIERS = [
    { min: 0, max: 17, fee: null, tier: 'Chưa đủ tuổi tham gia', color: '#E65100' },
    { min: 18, max: 30, fee: '500.000', tier: 'Thẻ Bạc', color: '#9E9E9E', cardClass: 'tier-silver', features: ['Bảo vệ y tế nội trú cơ bản', 'Đền bù tai nạn lên đến 50 triệu', 'Hỗ trợ chi phí nằm viện công', 'Hỗ trợ khẩn cấp 24/7'] },
    { min: 31, max: 40, fee: '800.000', tier: 'Thẻ Titan', color: '#546E7A', cardClass: 'tier-titan', features: ['Bảo vệ y tế nội & ngoại trú cơ bản', 'Đền bù tai nạn lên đến 150 triệu', 'Hỗ trợ nằm viện tại bệnh viện tư (nội trú)', 'Bảo lãnh viện phí nhanh 24/7'] },
    { min: 41, max: 50, fee: '1.200.000', tier: 'Thẻ Vàng', color: '#F9A825', cardClass: 'tier-gold', features: ['Bảo vệ y tế nội & ngoại trú toàn diện', 'Đền bù tai nạn lên đến 400 triệu', 'Hỗ trợ nằm viện phòng tiêu chuẩn riêng', 'Bảo lãnh viện phí bệnh viện quốc tế'] },
    { min: 51, max: 60, fee: '1.800.000', tier: 'Thẻ Bạch Kim', color: '#90A4AE', cardClass: 'tier-platinum', features: ['Quyền lợi y tế VIP toàn quốc', 'Đền bù tai nạn lên đến 800 triệu', 'Nằm viện phòng Suite cao cấp tự chọn', 'Hỗ trợ khẩn cấp và bảo lãnh viện phí VIP 24/7'] },
    { min: 61, max: 75, fee: '3.000.000', tier: 'Thẻ Kim Cương', color: '#1565C0', cardClass: 'tier-diamond', features: ['Bảo hiểm y tế toàn cầu VIP', 'Đền bù tai nạn lên đến 2 Tỷ đồng', 'Hỗ trợ chi phí điều trị tại nước ngoài', 'Dịch vụ bác sĩ gia đình & vận chuyển cấp cứu quốc tế'] },
    { min: 76, max: 999, fee: null, tier: 'Không đủ điều kiện tham gia (Tối đa 75 tuổi)', color: '#D32F2F' }
  ];

  const form = document.getElementById('quoteForm');
  const result = document.getElementById('quoteResult');
  const allCards = document.querySelectorAll('.tier');
  const tiersGrid = document.querySelector('.tiers-grid');
  const showAllBtnContainer = document.getElementById('show-all-tiers-container');

  const esc = s => s.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));

  function resetTierCards() {
    allCards.forEach(card => {
      card.classList.remove('tier-hidden', 'tier--recommended', 'tier--disabled');
    });
    if (tiersGrid) {
      tiersGrid.classList.remove('tiers-grid--filtered');
    }
    if (showAllBtnContainer) {
      showAllBtnContainer.style.display = 'none';
    }
  }

  function clearQuoteResult() {
    result.innerHTML = '';
    result.classList.remove('show');
    result.style.display = 'none';
  }

  ['qName', 'qPhone', 'qAge'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        const errEl = document.getElementById(id + 'Err');
        if (errEl) errEl.textContent = '';
      });
    }
  });

  function validateForm() {
    let valid = true;
    const name = document.getElementById('qName').value.trim();
    const phoneRaw = document.getElementById('qPhone').value.trim();
    const ageVal = document.getElementById('qAge').value;
    const age = parseInt(ageVal);

    // Clean phone number: remove spaces, dots, dashes
    const phone = phoneRaw.replace(/[\s.-]/g, '');

    document.getElementById('qNameErr').textContent = '';
    document.getElementById('qPhoneErr').textContent = '';
    document.getElementById('qAgeErr').textContent = '';

    if (!name) {
      document.getElementById('qNameErr').textContent = 'Vui lòng nhập họ tên.';
      valid = false;
    }
    if (!/^0[0-9]{9}$/.test(phone)) {
      document.getElementById('qPhoneErr').textContent = 'Số điện thoại phải đủ 10 số và bắt đầu bằng 0.';
      valid = false;
    }
    if (isNaN(age) || age < 0 || age > 120) {
      document.getElementById('qAgeErr').textContent = 'Tuổi phải là số nguyên từ 0 đến 120.';
      valid = false;
    }
    return valid ? { name, phone, age } : null;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = validateForm();
    if (!data) return;

    const age = data.age;
    const tier = INSURANCE_TIERS.find(t => age >= t.min && age <= t.max);

    // Save lead to backend database asynchronously
    fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        age: data.age,
        recommendedTier: tier ? tier.tier : 'N/A'
      })
    }).catch(err => {
      console.error('Failed to submit quote lead:', err);
    });

    resetTierCards();

    if (tier && tier.fee) {
      result.style.display = 'none';
      result.classList.remove('show');

      allCards.forEach(card => {
        if (card.classList.contains(tier.cardClass)) {
          card.classList.add('tier--recommended');
        } else {
          card.classList.add('tier-hidden');
        }
      });

      if (tiersGrid) {
        tiersGrid.classList.add('tiers-grid--filtered');
      }
      if (showAllBtnContainer) {
        showAllBtnContainer.style.display = 'block';
      }
    } else {
      // Display message for ineligible age
      const resultDiv = document.createElement('div');
      const topDiv = document.createElement('div');
      topDiv.className = 'result__top';
      topDiv.innerHTML = `Xin chào, <strong>${esc(data.name)}</strong>!`;
      
      const recDiv = document.createElement('div');
      recDiv.className = 'result__rec';
      const ageP = document.createElement('p');
      ageP.style.cssText = 'margin: 0; color: #111;';
      ageP.innerHTML = `Tuổi của bạn: <strong>${age} tuổi</strong>`;
      
      const statusDiv = document.createElement('div');
      statusDiv.style.cssText = `color: ${tier ? tier.color : '#D32F2F'}; font-weight: 700; font-size: 1.05rem; margin-top: 0.75rem; padding: 0.75rem; background: rgba(211, 47, 47, 0.05); border-left: 4px solid ${tier ? tier.color : '#D32F2F'}; border-radius: 8px;`;
      statusDiv.textContent = tier ? tier.tier : 'Không đủ điều kiện tham gia';
      
      recDiv.appendChild(ageP);
      recDiv.appendChild(statusDiv);
      resultDiv.appendChild(topDiv);
      resultDiv.appendChild(recDiv);
      
      result.innerHTML = '';
      result.appendChild(resultDiv);
      result.classList.add('show');
      result.style.display = 'block';

      allCards.forEach(card => {
        card.classList.add('tier--disabled');
      });
    }

    setTimeout(() => {
      const tiersSection = document.getElementById('tiers');
      if (tiersSection) {
        tiersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 400);
  });

  form.addEventListener('reset', () => {
    document.querySelectorAll('.field-error').forEach(err => {
      err.textContent = '';
    });
    clearQuoteResult();
    resetTierCards();
  });

  const btnShowAllTiers = document.getElementById('btn-show-all-tiers');
  if (btnShowAllTiers) {
    btnShowAllTiers.addEventListener('click', () => {
      allCards.forEach(card => {
        card.classList.remove('tier-hidden');
      });
      const grid = document.querySelector('.tiers-grid');
      if (grid) grid.classList.remove('tiers-grid--filtered');
      if (showAllBtnContainer) showAllBtnContainer.style.display = 'none';
    });
  }

  /* ---------- Reveal ---------- */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          obs.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(el => io.observe(el));
  }

});