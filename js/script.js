/* ============================================================
   MCONIC Redesign — js/script.js
   ============================================================ */
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

  // Xử lý tất cả các link trong panel (mobile menu) — QUAN TRỌNG
  panel.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
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
      // Với link điều hướng sang trang khác hoặc external
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

  /* ---------- Smooth scroll for same-page anchors (chỉ áp dụng cho anchor không nằm trong panel) ---------- */
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

  /* ---------- FAQ accordion ---------- */
  const qs = document.querySelectorAll('.faq__q');
  qs.forEach(btn => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      qs.forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.style.maxHeight = null;
      });
      if (!open) {
        btn.setAttribute('aria-expanded', 'true');
        const ans = btn.nextElementSibling;
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Document Request Modal & API Connection ---------- */
  const docModal = document.getElementById('docModal');
  const docModalForm = document.getElementById('docModalForm');
  const modalDocId = document.getElementById('modalDocId');
  const docModalClose = document.getElementById('docModalClose');
  const docModalOverlay = document.getElementById('docModalOverlay');
  let originalModalBodyHtml = '';

  if (docModal) {
    const modalBody = docModal.querySelector('.modal__body');
    if (modalBody) {
      originalModalBodyHtml = modalBody.innerHTML;
    }
  }

  const openDocModal = (docId) => {
    if (!docModal) return;
    const activeDocIdInput = document.getElementById('modalDocId');
    if (activeDocIdInput) {
      activeDocIdInput.value = docId;
    }
    docModal.classList.add('active');
    docModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeDocModal = () => {
    if (!docModal) return;
    docModal.classList.remove('active');
    docModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Restore original modal body HTML to reset the success screen back to form
    const modalBody = docModal.querySelector('.modal__body');
    if (modalBody && originalModalBodyHtml) {
      modalBody.innerHTML = originalModalBodyHtml;
      // Rebind event listeners
      docModal.querySelector('#docModalClose').addEventListener('click', closeDocModal);
      bindDocForm();
    }
  };

  if (docModalClose) docModalClose.addEventListener('click', closeDocModal);
  if (docModalOverlay) docModalOverlay.addEventListener('click', closeDocModal);

  document.querySelectorAll('[data-doc]').forEach(b => {
    b.addEventListener('click', () => {
      const doc = b.getAttribute('data-doc');
      openDocModal(doc);
    });
  });

  function bindDocForm() {
    const currentForm = document.getElementById('docModalForm');
    if (!currentForm) return;

    ['mName', 'mEmail'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          const errEl = document.getElementById(id + 'Err');
          if (errEl) errEl.textContent = '';
        });
      }
    });

    currentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('mName').value.trim();
      const email = document.getElementById('mEmail').value.trim();
      const docId = document.getElementById('modalDocId').value;
      
      document.getElementById('mNameErr').textContent = '';
      document.getElementById('mEmailErr').textContent = '';
      
      let ok = true;
      if (!name) { document.getElementById('mNameErr').textContent = 'Vui lòng nhập họ và tên.'; ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById('mEmailErr').textContent = 'Email không hợp lệ.'; ok = false; }
      
      if (!ok) return;

      const btn = currentForm.querySelector('button[type="submit"]');
      btn.classList.add('is-loading');
      btn.disabled = true;

      try {
        const response = await fetch('/api/leads/document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, docId })
        });
        const result = await response.json();

        if (response.ok && result.success) {
          // Show professional e-commercial success view inside modal
          const modalBody = docModal.querySelector('.modal__body');
          modalBody.innerHTML = `
            <button class="modal__close" id="docModalClose" aria-label="Đóng"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
            <div style="text-align: center; padding: 2.2rem 1rem;">
              <div style="font-size: 4rem; color: var(--red); margin-bottom: 1.2rem; transform: scale(0); animation: popScale 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;"><i class="fa-solid fa-circle-check"></i></div>
              <h3 style="font-size: 1.6rem; text-transform: uppercase; margin-bottom: 0.6rem; font-family: var(--font-display); font-weight: 800;">Gửi tài liệu thành công!</h3>
              <p style="color: var(--ink-soft); font-size: 0.96rem; line-height: 1.6; margin-bottom: 1.8rem; font-family: var(--font-body);">
                Chúng tôi đã gửi file tài liệu vào hộp thư của bạn:<br>
                <strong style="color: var(--ink); word-break: break-all;">${email}</strong>.<br>
                Vui lòng kiểm tra hộp thư đến (hoặc thư rác/spam).
              </p>
              <button class="btn btn-red" id="successModalCloseBtn" style="width: 100%;">Hoàn tất</button>
            </div>
            <style>
              @keyframes popScale { to { transform: scale(1); } }
            </style>
          `;
          modalBody.querySelector('#docModalClose').addEventListener('click', closeDocModal);
          modalBody.querySelector('#successModalCloseBtn').addEventListener('click', closeDocModal);
        } else {
          alert('Lỗi: ' + (result.message || 'Không thể gửi yêu cầu tài liệu.'));
        }
      } catch (err) {
        console.error(err);
        alert('Lỗi kết nối. Không thể gửi yêu cầu tài liệu vào lúc này.');
      } finally {
        btn.classList.remove('is-loading');
        btn.disabled = false;
      }
    });
  }

  // Initial binding of Document Modal Form
  bindDocForm();


  /* ---------- Contact form API Connection ---------- */
  const form = document.getElementById('contactForm');
  let originalFormHtml = '';
  if (form) {
    originalFormHtml = form.innerHTML;
  }

  function bindContactForm() {
    const currentForm = document.getElementById('contactForm');
    if (!currentForm) return;

    const clear = () => currentForm.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    
    ['cName', 'cPhone', 'cEmail'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          const errEl = document.getElementById(id + 'Err');
          if (errEl) errEl.textContent = '';
        });
      }
    });

    currentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clear();
      
      const name = document.getElementById('cName').value.trim();
      const phoneRaw = document.getElementById('cPhone').value.trim();
      const email = document.getElementById('cEmail').value.trim();
      
      // Clean phone number: remove spaces, dots, dashes
      const phone = phoneRaw.replace(/[\s.-]/g, '');

      let ok = true;
      if (!name) { document.getElementById('cNameErr').textContent = 'Vui lòng nhập họ và tên.'; ok = false; }
      if (!/^0[0-9]{9}$/.test(phone)) { document.getElementById('cPhoneErr').textContent = 'Số điện thoại phải đủ 10 số và bắt đầu bằng 0.'; ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById('cEmailErr').textContent = 'Email không hợp lệ.'; ok = false; }
      
      if (!ok) return;

      const btn = currentForm.querySelector('button[type="submit"]');
      btn.classList.add('is-loading');
      btn.disabled = true;

      try {
        const response = await fetch('/api/leads/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, email })
        });
        const result = await response.json();

        if (response.ok && result.success) {
          // Show professional e-commercial success view inline
          currentForm.innerHTML = `
            <div style="text-align: center; padding: 2.5rem 1.2rem; background: var(--paper-2); border: 2px solid var(--ink); border-radius: var(--r-md); box-shadow: var(--shadow-pop);">
              <div style="font-size: 4.5rem; color: var(--red); margin-bottom: 1.2rem; transform: scale(0); animation: popScale 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;"><i class="fa-solid fa-circle-check"></i></div>
              <h3 style="font-size: 1.6rem; text-transform: uppercase; margin-bottom: 0.6rem; font-family: var(--font-display); font-weight: 800;">Đăng ký thành công!</h3>
              <p style="color: var(--ink-soft); font-size: 0.98rem; line-height: 1.6; margin-bottom: 1.8rem; font-family: var(--font-body);">
                Cảm ơn bạn, <strong>${name}</strong>!<br>
                Email xác nhận đã được gửi tới <strong>${email}</strong>.<br>
                Chuyên viên hoạch định sự kiện của MCONIC sẽ liên hệ tư vấn qua số điện thoại <strong>${phoneRaw}</strong> trong vòng 24h làm việc.
              </p>
              <button class="btn btn-outline" id="resetContactFormBtn" style="width: 100%;">Gửi yêu cầu khác</button>
            </div>
            <style>
              @keyframes popScale { to { transform: scale(1); } }
            </style>
          `;
          
          currentForm.querySelector('#resetContactFormBtn').addEventListener('click', () => {
            currentForm.innerHTML = originalFormHtml;
            bindContactForm();
          });
        } else {
          alert('Lỗi: ' + (result.message || 'Không thể gửi yêu cầu tư vấn.'));
        }
      } catch (err) {
        console.error(err);
        alert('Lỗi kết nối. Vui lòng thử lại sau.');
      } finally {
        btn.classList.remove('is-loading');
        btn.disabled = false;
      }
    });
  }

  // Initial binding of Contact Form
  bindContactForm();

  /* ---------- Reveal: single orchestrated entrance ---------- */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(el => io.observe(el));
  }

});