/**
 * AVI CONSULTANCY — CLIENT PORTAL SCRIPT
 * Interactive Fee Calculator, Mobile Drawer, Corporate Agreement Generator, Job Filters
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. MOBILE DRAWER NAVIGATION
  // ==========================================
  const mobileToggleBtn = document.getElementById('mobile_toggle_btn');
  const mobileDrawer = document.getElementById('mobile_drawer_menu');
  const drawerOverlay = document.getElementById('drawer_overlay');
  const mobileDrawerClose = document.getElementById('mobile_drawer_close');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggleBtn) mobileToggleBtn.addEventListener('click', openDrawer);
  if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ==========================================
  // 2. ACTIVE NAVBAR LINK HIGHLIGHTING
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // 3. INTERACTIVE PLACEMENT FEE CALCULATOR (8.33% CTC)
  // ==========================================
  const ctcSlider = document.getElementById('ctc_slider');
  const ctcValText = document.getElementById('ctc_val_text');
  const feeDisplay = document.getElementById('fee_display');
  const quickCtcBtns = document.querySelectorAll('.quick-ctc-btn');

  function formatIndianRupee(num) {
    return '₹ ' + Math.round(num).toLocaleString('en-IN');
  }

  function updateFee() {
    if (!ctcSlider || !ctcValText || !feeDisplay) return;
    const ctc = parseFloat(ctcSlider.value);
    ctcValText.textContent = formatIndianRupee(ctc);
    
    // Exact 8.33% calculation
    const fee = ctc * 0.0833;
    feeDisplay.textContent = formatIndianRupee(fee);
  }

  if (ctcSlider) {
    ctcSlider.addEventListener('input', updateFee);
    updateFee(); // Initialize
  }

  quickCtcBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetVal = btn.getAttribute('data-ctc');
      if (targetVal && ctcSlider) {
        ctcSlider.value = targetVal;
        updateFee();
      }
    });
  });

  // ==========================================
  // 4. CANDIDATE JOB LISTING CATEGORY FILTERS
  // ==========================================
  const filterBtns = document.querySelectorAll('.job-filter-btn');
  const jobCards = document.querySelectorAll('.job-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      jobCards.forEach(card => {
        const cat = card.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // 5. MODAL SYSTEM
  // ==========================================
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtns = document.querySelectorAll('.modal-close-btn');

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModal = btn.getAttribute('data-modal');
      const jobTitle = btn.getAttribute('data-job');

      if (targetModal) {
        if (targetModal === 'modal_candidate' && jobTitle) {
          const fieldSelect = document.getElementById('cand_field');
          if (fieldSelect) {
            // Preset suggestion if matching
            const opt = Array.from(fieldSelect.options).find(o => o.text.toLowerCase().includes(jobTitle.toLowerCase()));
            if (opt) fieldSelect.value = opt.value;
          }
        }
        openModal(targetModal);
      }
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalOverlays.forEach(m => closeModal(m));
      closeDrawer();
    }
  });

  // ==========================================
  // 6. CORPORATE AGREEMENT PREVIEW & SUBMISSION
  // ==========================================
  const btnPreview = document.getElementById('btn_preview_agreement');
  const corpForm = document.getElementById('corporate_agreement_form');

  function populateAgreementPreview() {
    const coName = document.getElementById('co_name').value.trim() || '[Your Company Name]';
    const coGst = document.getElementById('co_gst').value.trim() || 'N/A';
    const coAddress = document.getElementById('co_address').value.trim() || '[Registered Office Address]';
    const coordName = document.getElementById('client_coord_name').value.trim() || '[Coordinator Name]';
    const coordEmail = document.getElementById('coord_email').value.trim() || '[Coordinator Email]';
    const coordContact = document.getElementById('coord_contact').value.trim() || '[Coordinator Contact]';

    document.getElementById('prev_co_name').textContent = coName;
    document.getElementById('prev_client_name').textContent = coName;
    document.getElementById('prev_sign_client').textContent = coName;
    document.getElementById('prev_client_gst').textContent = coGst;
    document.getElementById('prev_client_address').textContent = coAddress;
    document.getElementById('prev_coord_name').textContent = coordName;
    document.getElementById('prev_coord_email').textContent = coordEmail;
    document.getElementById('prev_coord_contact').textContent = coordContact;

    // Date & Random Ref Code
    const today = new Date();
    const dateFormatted = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('prev_date').textContent = dateFormatted;
    document.getElementById('prev_ref').textContent = `AVI/CORP/${today.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  if (btnPreview) {
    btnPreview.addEventListener('click', () => {
      populateAgreementPreview();
      openModal('modal_agreement_preview');
    });
  }

  // Print Agreement Draft
  const btnPrint = document.getElementById('btn_print_agreement');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // Submit Corporate Form
  if (corpForm) {
    corpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      populateAgreementPreview();

      const coName = document.getElementById('co_name').value.trim();
      const coordName = document.getElementById('client_coord_name').value.trim();

      // Dispatch alert and show preview modal
      alert(`Thank you, ${coordName}!\n\nYour Corporate Recruitment Tie-Up details for "${coName}" have been generated successfully under our standard terms:\n• 90-Day Free Replacement Guarantee\n• 8.33% CTC Service Fee\n• 15-Day Payment Period\n\nOpening the official agreement preview now.`);

      openModal('modal_agreement_preview');
    });
  }

  const btnConfirmModal = document.getElementById('btn_confirm_agreement_modal');
  if (btnConfirmModal) {
    btnConfirmModal.addEventListener('click', () => {
      alert('Agreement confirmed! Our recruitment coordinator will reach out to you within 2-4 hours to begin candidate sourcing.');
      closeModal(document.getElementById('modal_agreement_preview'));
      if (corpForm) corpForm.reset();
    });
  }

  // ==========================================
  // 7. CANDIDATE APPLY FORM SUBMISSION
  // ==========================================
  const candForm = document.getElementById('candidate_apply_form');
  if (candForm) {
    candForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const candName = document.getElementById('cand_name').value.trim();
      alert(`Thank you, ${candName}!\n\nYour resume has been successfully submitted to Avi Consultancy's central talent pool. Our executive recruitment consultants will contact you for matching openings.`);
      closeModal(document.getElementById('modal_candidate'));
      candForm.reset();
    });
  }

});
