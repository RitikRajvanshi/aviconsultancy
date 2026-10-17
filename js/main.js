/**
 * AVI CONSULTANCY — CLIENT PORTAL SCRIPT
 * Interactive Fee Calculator, Mobile Drawer, Corporate Agreement Generator, Job Filters
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 0. SITE PRELOADER (Inspired by eepicmanagement.com)
  // ==========================================
  const preloader = document.getElementById('site_preloader');
  if (preloader) {
    let dismissed = false;
    function hidePreloader() {
      if (dismissed) return;
      dismissed = true;
      preloader.classList.add('loaded');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 600);
    }

    // Dismiss on window load with smooth visual duration
    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 700);
    } else {
      window.addEventListener('load', () => {
        setTimeout(hidePreloader, 700);
      });
    }

    // Fallback safety timeout (guarantees loader never freezes)
    setTimeout(hidePreloader, 1600);
  }

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

  // ==========================================
  // EMAIL DISPATCH CONFIGURATION & LOGIC
  // ==========================================
  const AVI_PRIMARY_EMAIL = 'aviconsultancy1@outlook.com';
  const AVI_CC_EMAIL = 'raj.ritik00789@gmail.com';

  async function dispatchEmailNotification(endpointData, makeFormData) {
    // 1. Submit directly to raj.ritik00789@gmail.com FIRST (Verified & Active on FormSubmit)
    try {
      const fdRitik = makeFormData();
      const res = await fetch(`https://formsubmit.co/ajax/${AVI_CC_EMAIL}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: fdRitik
      });
      const resJson = await res.json();
      console.log('FormSubmit delivery result for raj.ritik00789@gmail.com:', resJson);
    } catch (err) {
      console.warn('FormSubmit Ritik dispatch notice:', err);
    }

    // 2. Also submit to aviconsultancy1@outlook.com
    try {
      const fdAvi = makeFormData();
      await fetch(`https://formsubmit.co/ajax/${AVI_PRIMARY_EMAIL}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: fdAvi
      });
    } catch (err) {
      console.warn('FormSubmit primary dispatch notice:', err);
    }

    // 3. Submit to local server API for persistence in data/submissions.json
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(endpointData)
      });
    } catch (err) {
      // Local API is active when running on Node.js dev server
    }
  }

  // Success Modal Close Handlers
  const successModal = document.getElementById('modal_submission_success');
  const btnCloseSuccess = document.getElementById('btn_close_success_modal');
  const btnXSuccess = document.getElementById('btn_x_success_modal');
  if (btnCloseSuccess) btnCloseSuccess.addEventListener('click', () => closeModal(successModal));
  if (btnXSuccess) btnXSuccess.addEventListener('click', () => closeModal(successModal));

  // ==========================================
  // 6. CORPORATE AGREEMENT FORM SUBMISSION
  // ==========================================
  async function handleCorporateSubmit() {
    populateAgreementPreview();

    const submitBtn = document.getElementById('btn_submit_agreement');
    const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span style="display:inline-block;animation:spin 1s linear infinite;margin-right:8px;">&#9696;</span> Dispatching Agreement &amp; Sending Email...`;
    }

    const coName = document.getElementById('co_name').value.trim();
    const coGst = document.getElementById('co_gst').value.trim() || 'N/A';
    const coAddress = document.getElementById('co_address').value.trim();
    const coordName = document.getElementById('client_coord_name').value.trim();
    const coordEmail = document.getElementById('coord_email').value.trim();
    const coordContact = document.getElementById('coord_contact').value.trim();
    const industrySelect = document.getElementById('job_industry_field');
    const industry = industrySelect ? industrySelect.value : 'Multiple / General';
    const vacancies = document.getElementById('open_vacancies').value.trim() || 'Not specified';
    const refCode = document.getElementById('prev_ref').textContent.trim() || `AVI/CORP/${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const timeIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Fresh FormData factory
    function makeFormData() {
      const fsData = new FormData();
      fsData.append('_subject', `[Avi Corporate Tie-Up] ${coName} - Agreement Request (${refCode})`);
      fsData.append('_cc', AVI_PRIMARY_EMAIL);
      fsData.append('_replyto', coordEmail);
      fsData.append('_template', 'table');
      fsData.append('_captcha', 'false');
      fsData.append('Organization Name', coName);
      fsData.append('Company GSTIN', coGst);
      fsData.append('Registered Office Address', coAddress);
      fsData.append('Client Coordinator Name', coordName);
      fsData.append('Coordinator Email', coordEmail);
      fsData.append('Coordinator Contact', coordContact);
      fsData.append('Hiring Industry / Field', industry);
      fsData.append('Vacancies Count', vacancies);
      fsData.append('Commercial Terms Agreed', '8.33% CTC Fee | 90-Day Free Replacement Guarantee | 10-15 Day Payment Window');
      fsData.append('Agreement Reference Number', refCode);
      fsData.append('Submission Time (IST)', timeIST);
      return fsData;
    }

    // Prepare Backend JSON payload
    const endpointData = {
      formType: 'Corporate Agreement',
      subject: `[Avi Corporate Tie-Up] ${coName} - Agreement Request (${refCode})`,
      to: AVI_PRIMARY_EMAIL,
      cc: AVI_CC_EMAIL,
      replyTo: coordEmail,
      ref: refCode,
      fields: {
        company: coName,
        gst: coGst,
        address: coAddress,
        coordinator: coordName,
        email: coordEmail,
        contact: coordContact,
        industry: industry,
        vacancies: vacancies,
        terms: '8.33% CTC Fee | 90-Day Free Replacement | 15-Day Payment Window',
        submittedAtIST: timeIST
      }
    };

    await dispatchEmailNotification(endpointData, makeFormData);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origBtnHtml;
    }

    // Populate Success Modal
    const summaryBox = document.getElementById('success_summary_box');
    const mailtoBtn = document.getElementById('success_mailto_btn');

    if (summaryBox) {
      summaryBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem; border-bottom: 1px dashed #e2e8f0; padding-bottom: 0.4rem;">
          <span style="color: #64748b;">Ref Code:</span>
          <strong style="color: #0284c7; font-family: var(--font-mono);">${refCode}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem;">
          <span style="color: #64748b;">Organization:</span>
          <strong style="color: #0f172a;">${coName}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem;">
          <span style="color: #64748b;">Coordinator:</span>
          <span>${coordName} (${coordContact})</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem;">
          <span style="color: #64748b;">Agreed Terms:</span>
          <span style="color: #059669; font-weight: 600;">8.33% CTC &bull; 90-Day Replacement</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 0.6rem; padding-top: 0.4rem; border-top: 1px solid #e2e8f0;">
          <span style="color: #64748b;">Sent Directly To:</span>
          <span style="color: #059669; font-weight: 700;">${AVI_CC_EMAIL}<br><small style="color: #64748b; font-weight: 400;">CC: ${AVI_PRIMARY_EMAIL}</small></span>
        </div>
      `;
    }

    const mailtoSubject = encodeURIComponent(`[Avi Corporate Tie-Up] ${coName} - Agreement (${refCode})`);
    const mailtoBody = encodeURIComponent(
      `Hello Avi Consultancy Team,\n\n` +
      `We have submitted our Corporate Recruitment Tie-Up details:\n` +
      `• Agreement Ref: ${refCode}\n` +
      `• Organization: ${coName}\n` +
      `• GST: ${coGst}\n` +
      `• Address: ${coAddress}\n` +
      `• Coordinator: ${coordName} (${coordContact}, ${coordEmail})\n` +
      `• Industry / Roles: ${industry}\n` +
      `• Vacancies: ${vacancies}\n\n` +
      `Agreed Commercial Terms:\n` +
      `• 90-Day Free Candidate Replacement Guarantee\n` +
      `• 8.33% Annual CTC Service Fee\n` +
      `• 10-15 Day Payment Window\n\n` +
      `Please proceed with candidate sourcing.\n`
    );
    if (mailtoBtn) {
      mailtoBtn.href = `mailto:${AVI_CC_EMAIL}?cc=${AVI_PRIMARY_EMAIL}&subject=${mailtoSubject}&body=${mailtoBody}`;
    }

    openModal('modal_submission_success');
  }

  if (corpForm) {
    corpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleCorporateSubmit();
    });
  }

  const btnConfirmModal = document.getElementById('btn_confirm_agreement_modal');
  if (btnConfirmModal) {
    btnConfirmModal.addEventListener('click', () => {
      closeModal(document.getElementById('modal_agreement_preview'));
      handleCorporateSubmit();
    });
  }

  // ==========================================
  // 7. CANDIDATE APPLY FORM SUBMISSION
  // ==========================================
  const candForm = document.getElementById('candidate_apply_form');
  if (candForm) {
    candForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const candSubmitBtn = document.getElementById('btn_submit_candidate') || candForm.querySelector('button[type="submit"]');
      const origBtnHtml = candSubmitBtn ? candSubmitBtn.innerHTML : '';
      if (candSubmitBtn) {
        candSubmitBtn.disabled = true;
        candSubmitBtn.innerHTML = `<span style="display:inline-block;animation:spin 1s linear infinite;margin-right:8px;">&#9696;</span> Submitting Application &amp; Sending Email...`;
      }

      const candName = document.getElementById('cand_name').value.trim();
      const candPhone = document.getElementById('cand_phone').value.trim();
      const candEmail = document.getElementById('cand_email').value.trim();
      const candExp = document.getElementById('cand_exp').value;
      const candField = document.getElementById('cand_field').value;
      const candCtc = document.getElementById('cand_ctc').value.trim() || 'Not Disclosed';
      const candLocation = document.getElementById('cand_location').value.trim() || 'Flexible / Open to relocate';
      const fileInput = document.getElementById('cand_resume_file');
      const resumeFile = (fileInput && fileInput.files && fileInput.files[0]) ? fileInput.files[0] : null;
      const resumeName = resumeFile ? resumeFile.name : 'Uploaded File';
      const timeIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      // Fresh FormData factory
      function makeCandFormData() {
        const fsData = new FormData();
        fsData.append('_subject', `[Avi Job Application] ${candName} - ${candField} (${candExp})`);
        fsData.append('_cc', AVI_PRIMARY_EMAIL);
        fsData.append('_replyto', candEmail);
        fsData.append('_template', 'table');
        fsData.append('_captcha', 'false');
        fsData.append('Candidate Full Name', candName);
        fsData.append('Mobile Number', candPhone);
        fsData.append('Email Address', candEmail);
        fsData.append('Functional Domain / Speciality', candField);
        fsData.append('Total Work Experience', candExp);
        fsData.append('Current Annual CTC', candCtc);
        fsData.append('Preferred Job Location', candLocation);
        fsData.append('Submission Time (IST)', timeIST);
        if (resumeFile) {
          fsData.append('Resume File', resumeFile, resumeFile.name);
        }
        return fsData;
      }

      // Prepare Backend JSON
      const endpointData = {
        formType: 'Candidate Application',
        subject: `[Avi Job Application] ${candName} - ${candField} (${candExp})`,
        to: AVI_PRIMARY_EMAIL,
        cc: AVI_CC_EMAIL,
        replyTo: candEmail,
        fields: {
          candidateName: candName,
          phone: candPhone,
          email: candEmail,
          domain: candField,
          experience: candExp,
          currentCtc: candCtc,
          preferredLocation: candLocation,
          resumeFileName: resumeName,
          submittedAtIST: timeIST
        }
      };

      await dispatchEmailNotification(endpointData, makeCandFormData);

      if (candSubmitBtn) {
        candSubmitBtn.disabled = false;
        candSubmitBtn.innerHTML = origBtnHtml;
      }

      closeModal(document.getElementById('modal_candidate'));

      // Populate Success Modal
      const summaryBox = document.getElementById('success_summary_box');
      const mailtoBtn = document.getElementById('success_mailto_btn');

      if (summaryBox) {
        summaryBox.innerHTML = `
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem;">
            <span style="color: #64748b;">Applicant Name:</span>
            <strong style="color: #0f172a;">${candName}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem;">
            <span style="color: #64748b;">Contact:</span>
            <span>${candPhone} &bull; ${candEmail}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem;">
            <span style="color: #64748b;">Domain:</span>
            <strong style="color: #0284c7;">${candField}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem;">
            <span style="color: #64748b;">Experience / CTC:</span>
            <span>${candExp} &bull; ${candCtc}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem;">
            <span style="color: #64748b;">Attached Resume:</span>
            <span style="color: #0f172a; font-weight: 600;">&#128196; ${resumeName}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 0.6rem; padding-top: 0.4rem; border-top: 1px solid #e2e8f0;">
            <span style="color: #64748b;">Sent Directly To:</span>
            <span style="color: #059669; font-weight: 700;">${AVI_CC_EMAIL}<br><small style="color: #64748b; font-weight: 400;">CC: ${AVI_PRIMARY_EMAIL}</small></span>
          </div>
        `;
      }

      const mailtoSubject = encodeURIComponent(`[Avi Job Application] ${candName} - ${candField}`);
      const mailtoBody = encodeURIComponent(
        `Hello Avi Consultancy Recruitment Team,\n\n` +
        `I have submitted my job application through the Avi Consultancy portal:\n` +
        `• Name: ${candName}\n` +
        `• Mobile: ${candPhone}\n` +
        `• Email: ${candEmail}\n` +
        `• Functional Domain: ${candField}\n` +
        `• Total Experience: ${candExp}\n` +
        `• Current CTC: ${candCtc}\n` +
        `• Preferred Location: ${candLocation}\n` +
        `• Attached Resume: ${resumeName}\n\n` +
        `Please consider my profile for suitable career opportunities.\n`
      );
      if (mailtoBtn) {
        mailtoBtn.href = `mailto:${AVI_CC_EMAIL}?cc=${AVI_PRIMARY_EMAIL}&subject=${mailtoSubject}&body=${mailtoBody}`;
      }

      candForm.reset();
      openModal('modal_submission_success');
    });
  }

});


