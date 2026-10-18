/**
 * AVI CONSULTANCY — CLIENT PORTAL SCRIPT
 * Services Showcase, Mobile Drawer, Corporate Mandate Generator, Job Filters, Candidate Applications
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
  // 3. SERVICE NAVIGATION & INTERACTION
  // ==========================================
  // Note: Direct corporate mandate model - zero fee charged to job aspirants

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
  const AVI_PRIMARY_EMAIL = 'poojapandey.ceo@aviconsultancy.in';
  const AVI_CC_EMAIL = 'raj.ritik00789@gmail.com';

  async function dispatchEmailNotification(endpointData, makeFormData) {
    // 1. Submit directly to Primary Email (poojapandey.ceo@aviconsultancy.in)
    try {
      const fdPrimary = makeFormData();
      await fetch(`https://formsubmit.co/ajax/${AVI_PRIMARY_EMAIL}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: fdPrimary
      });
    } catch (err) {
      console.warn('FormSubmit primary dispatch notice:', err);
    }

    // 2. Submit to CC (raj.ritik00789@gmail.com)
    try {
      const fdCc = makeFormData();
      await fetch(`https://formsubmit.co/ajax/${AVI_CC_EMAIL}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: fdCc
      });
    } catch (err) {
      console.warn('FormSubmit CC dispatch notice:', err);
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
  // FIELD VALIDATION UTILITIES (Phone 10-13 digits, Email, PDF max 500KB)
  // ==========================================
  function validateMobile(phone) {
    if (!phone || !phone.trim()) {
      return { valid: false, message: 'Mobile number is required.' };
    }
    const raw = phone.trim();
    // Allow optional leading +, digits, spaces, hyphens
    if (!/^\+?[0-9\s\-()]+$/.test(raw)) {
      return { valid: false, message: 'Mobile number can only contain digits and optional + country code.' };
    }
    const digitsOnly = raw.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 13) {
      return { valid: false, message: `Mobile number must contain 10 to 13 digits (currently ${digitsOnly.length} digits).` };
    }
    return { valid: true };
  }

  function validateEmail(email) {
    if (!email || !email.trim()) {
      return { valid: false, message: 'Email address is required.' };
    }
    const trimmed = email.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return { valid: false, message: 'Please enter a valid email address (e.g. name@example.com).' };
    }
    return { valid: true };
  }

  function validateResumeFile(file) {
    if (!file) {
      return { valid: false, message: 'Please select a resume file (PDF format, max 500 KB).' };
    }
    const fileName = file.name.toLowerCase();
    const isPdf = file.type === 'application/pdf' || fileName.endsWith('.pdf');
    if (!isPdf) {
      return { valid: false, message: 'Invalid file format. Only PDF documents (.pdf) are accepted.' };
    }
    const maxBytes = 500 * 1024; // 500 KB
    if (file.size > maxBytes) {
      const sizeKb = (file.size / 1024).toFixed(1);
      return { valid: false, message: `File size exceeds 500 KB limit (selected file is ${sizeKb} KB). Please upload a PDF under 500 KB.` };
    }
    return { valid: true };
  }

  function setFieldError(inputEl, errorEl, message) {
    if (inputEl) inputEl.classList.add('is-invalid');
    if (errorEl) {
      errorEl.textContent = message || '';
      errorEl.style.display = 'block';
    }
  }

  function clearFieldError(inputEl, errorEl) {
    if (inputEl) inputEl.classList.remove('is-invalid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  }

  // Real-time Candidate Resume File Change Listener
  const resumeFileInput = document.getElementById('cand_resume_file');
  const resumeFileStatus = document.getElementById('resume_file_status');
  if (resumeFileInput) {
    resumeFileInput.addEventListener('change', () => {
      const file = resumeFileInput.files && resumeFileInput.files[0];
      if (!file) {
        if (resumeFileStatus) resumeFileStatus.textContent = '';
        return;
      }
      const check = validateResumeFile(file);
      if (!check.valid) {
        resumeFileInput.classList.add('is-invalid');
        if (resumeFileStatus) {
          resumeFileStatus.className = 'form-file-status error';
          resumeFileStatus.textContent = check.message;
        }
        resumeFileInput.value = '';
      } else {
        resumeFileInput.classList.remove('is-invalid');
        if (resumeFileStatus) {
          resumeFileStatus.className = 'form-file-status success';
          resumeFileStatus.textContent = `✓ ${file.name} (${(file.size / 1024).toFixed(1)} KB) - Valid PDF under 500 KB`;
        }
      }
    });
  }

  // Live input error clearing
  const candPhoneInput = document.getElementById('cand_phone');
  const candPhoneError = document.getElementById('cand_phone_error');
  if (candPhoneInput) {
    candPhoneInput.addEventListener('input', () => {
      const check = validateMobile(candPhoneInput.value);
      if (check.valid) clearFieldError(candPhoneInput, candPhoneError);
    });
  }

  const candEmailInput = document.getElementById('cand_email');
  const candEmailError = document.getElementById('cand_email_error');
  if (candEmailInput) {
    candEmailInput.addEventListener('input', () => {
      const check = validateEmail(candEmailInput.value);
      if (check.valid) clearFieldError(candEmailInput, candEmailError);
    });
  }

  const coordContactInput = document.getElementById('coord_contact');
  const coordContactError = document.getElementById('coord_contact_error');
  if (coordContactInput) {
    coordContactInput.addEventListener('input', () => {
      const check = validateMobile(coordContactInput.value);
      if (check.valid) clearFieldError(coordContactInput, coordContactError);
    });
  }

  const coordEmailInput = document.getElementById('coord_email');
  const coordEmailError = document.getElementById('coord_email_error');
  if (coordEmailInput) {
    coordEmailInput.addEventListener('input', () => {
      const check = validateEmail(coordEmailInput.value);
      if (check.valid) clearFieldError(coordEmailInput, coordEmailError);
    });
  }

  // ==========================================
  // 6. CORPORATE AGREEMENT FORM SUBMISSION
  // ==========================================
  async function handleCorporateSubmit() {
    populateAgreementPreview();

    const coName = document.getElementById('co_name').value.trim();
    const coGst = document.getElementById('co_gst').value.trim() || 'N/A';
    const coAddress = document.getElementById('co_address').value.trim();
    const coordName = document.getElementById('client_coord_name').value.trim();
    const coordEmail = document.getElementById('coord_email').value.trim();
    const coordContact = document.getElementById('coord_contact').value.trim();

    // Enforce Field Validations
    clearFieldError(coordEmailInput, coordEmailError);
    clearFieldError(coordContactInput, coordContactError);

    let hasCorpError = false;
    const emailCheck = validateEmail(coordEmail);
    if (!emailCheck.valid) {
      setFieldError(coordEmailInput, coordEmailError, emailCheck.message);
      if (coordEmailInput) coordEmailInput.focus();
      hasCorpError = true;
    }

    const phoneCheck = validateMobile(coordContact);
    if (!phoneCheck.valid) {
      setFieldError(coordContactInput, coordContactError, phoneCheck.message);
      if (!hasCorpError && coordContactInput) coordContactInput.focus();
      hasCorpError = true;
    }

    if (hasCorpError) return;

    const submitBtn = document.getElementById('btn_submit_agreement');
    const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span style="display:inline-block;animation:spin 1s linear infinite;margin-right:8px;">&#9696;</span> Dispatching Agreement &amp; Sending Email...`;
    }

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
      fsData.append('Commercial Terms Agreed', 'Direct Corporate Engagement | 90-Day Free Replacement Guarantee | Zero Candidate Charges');
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
        terms: 'Direct Corporate Engagement | 90-Day Free Replacement Guarantee | Zero Candidate Charges',
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
          <span style="color: #059669; font-weight: 600;">Direct Corporate Mandate &bull; 90-Day Replacement</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 0.6rem; padding-top: 0.4rem; border-top: 1px solid #e2e8f0;">
          <span style="color: #64748b;">Sent Directly To:</span>
          <span style="color: #059669; font-weight: 700;">${AVI_PRIMARY_EMAIL}<br><small style="color: #64748b; font-weight: 400;">CC: ${AVI_CC_EMAIL}</small></span>
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
      `• Direct Corporate Engagement (Zero candidate charges)\n\n` +
      `Please proceed with candidate sourcing.\n`
    );
    if (mailtoBtn) {
      mailtoBtn.href = `mailto:${AVI_PRIMARY_EMAIL}?cc=${AVI_CC_EMAIL}&subject=${mailtoSubject}&body=${mailtoBody}`;
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

  // Helper: Read File as Base64 Data URL
  function readFileAsDataURL(file) {
    return new Promise((resolve) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  // ==========================================
  // 7. CANDIDATE APPLY FORM SUBMISSION
  // ==========================================
  const candForm = document.getElementById('candidate_apply_form');
  if (candForm) {
    candForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const candName = document.getElementById('cand_name').value.trim();
      const candPhone = document.getElementById('cand_phone').value.trim();
      const candEmail = document.getElementById('cand_email').value.trim();
      const candExp = document.getElementById('cand_exp').value;
      const candField = document.getElementById('cand_field').value;
      const candCtc = document.getElementById('cand_ctc').value.trim() || 'Not Disclosed';
      const candLocation = document.getElementById('cand_location').value.trim() || 'Flexible / Open to relocate';
      const fileInput = document.getElementById('cand_resume_file');
      const resumeFile = (fileInput && fileInput.files && fileInput.files[0]) ? fileInput.files[0] : null;

      // Validate Fields
      clearFieldError(candPhoneInput, candPhoneError);
      clearFieldError(candEmailInput, candEmailError);
      if (resumeFileStatus) resumeFileStatus.textContent = '';

      let hasCandError = false;

      const phoneCheck = validateMobile(candPhone);
      if (!phoneCheck.valid) {
        setFieldError(candPhoneInput, candPhoneError, phoneCheck.message);
        if (candPhoneInput) candPhoneInput.focus();
        hasCandError = true;
      }

      const emailCheck = validateEmail(candEmail);
      if (!emailCheck.valid) {
        setFieldError(candEmailInput, candEmailError, emailCheck.message);
        if (!hasCandError && candEmailInput) candEmailInput.focus();
        hasCandError = true;
      }

      const fileCheck = validateResumeFile(resumeFile);
      if (!fileCheck.valid) {
        if (fileInput) fileInput.classList.add('is-invalid');
        if (resumeFileStatus) {
          resumeFileStatus.className = 'form-file-status error';
          resumeFileStatus.textContent = fileCheck.message;
        }
        if (!hasCandError && fileInput) fileInput.focus();
        hasCandError = true;
      }

      if (hasCandError) {
        return;
      }

      const candSubmitBtn = document.getElementById('btn_submit_candidate') || candForm.querySelector('button[type="submit"]');
      const origBtnHtml = candSubmitBtn ? candSubmitBtn.innerHTML : '';
      if (candSubmitBtn) {
        candSubmitBtn.disabled = true;
        candSubmitBtn.innerHTML = `<span style="display:inline-block;animation:spin 1s linear infinite;margin-right:8px;">&#9696;</span> Saving Resume &amp; Dispatching Application...`;
      }

      const resumeName = resumeFile ? resumeFile.name : 'Uploaded File';
      const resumeSizeKb = resumeFile ? (resumeFile.size / 1024).toFixed(1) + ' KB' : 'Unknown';
      const timeIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      // Convert file to Base64 so the local server stores the exact file on disk
      let fileBase64 = null;
      if (resumeFile) {
        try {
          fileBase64 = await readFileAsDataURL(resumeFile);
        } catch (readErr) {
          console.warn('Error reading resume file:', readErr);
        }
      }

      const emailSubject = `New Job Application Received | ${candName} | ${candField}`;

      const professionalEmailBody =
`Dear Team,

A new job application has been received through the Aviconsultancy website. Please find the candidate's details below.

CANDIDATE DETAILS

Full Name: ${candName}

Mobile Number: ${candPhone}

Email Address: ${candEmail}

Total Experience: ${candExp}

Functional Domain: ${candField}

Current CTC (Per Annum): ${candCtc}

Preferred Location: ${candLocation}

Resume/CV: Please find the candidate's CV attached to this email for your review.

Kindly review the candidate's profile and resume for further evaluation and suitable job opportunities.

This application was submitted through the Aviconsultancy Careers Portal.

Best regards,
Team
Aviconsultancy

This is an automated notification generated by the Aviconsultancy website.`;

      // Prepare Backend JSON Payload for local server
      const endpointData = {
        formType: 'Candidate Application',
        subject: emailSubject,
        to: AVI_PRIMARY_EMAIL,
        cc: AVI_CC_EMAIL,
        replyTo: candEmail,
        fileName: resumeName,
        fileBase64: fileBase64,
        emailBody: professionalEmailBody,
        fields: {
          fullName: candName,
          mobileNumber: candPhone,
          emailAddress: candEmail,
          totalExperience: candExp,
          functionalDomain: candField,
          currentCtc: candCtc,
          preferredLocation: candLocation,
          resumeFileName: resumeName,
          resumeFileSize: resumeSizeKb,
          submittedAtIST: timeIST,
          formattedMessage: professionalEmailBody
        }
      };

      // 1. Send to local server API to save resume file to data/resumes/ and record in submissions.json
      let serverSavedResume = null;
      try {
        const localRes = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(endpointData)
        });
        const localData = await localRes.json();
        serverSavedResume = localData.savedResume;
      } catch (err) {
        console.warn('Local API storage notice:', err);
      }

      // 2. Submit the clean native HTML form directly into the hidden iframe
      // FormSubmit receives ONLY: _subject, _replyto, _cc, message, and attachment!
      // This prevents FormSubmit from printing 9 ugly duplicate boxes and matches a standard email sent in Gmail.
      try {
        const fsSubject = document.getElementById('cand_fs_subject');
        const fsReplyTo = document.getElementById('cand_fs_replyto');
        const fsMessage = document.getElementById('cand_fs_message');
        if (fsSubject) fsSubject.value = emailSubject;
        if (fsReplyTo) fsReplyTo.value = candEmail;
        if (fsMessage) fsMessage.value = professionalEmailBody;

        // Temporarily strip 'name' from individual input fields so FormSubmit does NOT create separate boxed sections
        const individualInputs = candForm.querySelectorAll('input[name], select[name]');
        const savedNames = [];
        individualInputs.forEach(el => {
          const nm = el.getAttribute('name');
          if (nm && !['_subject', '_replyto', '_cc', '_captcha', 'message', 'attachment'].includes(nm)) {
            savedNames.push({ el, name: nm });
            el.removeAttribute('name');
          }
        });

        // Trigger native submission into target="formsubmit_hidden_frame"
        HTMLFormElement.prototype.submit.call(candForm);

        // Restore input names immediately
        savedNames.forEach(item => {
          item.el.setAttribute('name', item.name);
        });
      } catch (fsErr) {
        console.warn('Native FormSubmit submission notice:', fsErr);
      }

      if (candSubmitBtn) {
        candSubmitBtn.disabled = false;
        candSubmitBtn.innerHTML = origBtnHtml;
      }

      closeModal(document.getElementById('modal_candidate'));

      // Populate Success Modal
      const summaryBox = document.getElementById('success_summary_box');
      const mailtoBtn = document.getElementById('success_mailto_btn');

      const resumeDownloadHtml = (serverSavedResume && serverSavedResume.url)
        ? `<a href="${serverSavedResume.url}" target="_blank" style="color: #0284c7; text-decoration: underline; font-weight: 600;">&#128196; ${resumeName} (${serverSavedResume.size})</a>`
        : `<span style="color: #0f172a; font-weight: 600;">&#128196; ${resumeName} (${resumeSizeKb})</span>`;

      if (summaryBox) {
        summaryBox.innerHTML = `
          <div style="margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e2e8f0; text-align: left;">
            <div style="font-size: 0.8rem; color: #64748b; font-weight: 600;">Subject Line:</div>
            <div style="font-weight: 700; color: #0284c7; font-size: 0.95rem;">${emailSubject}</div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem;">
            <span style="color: #64748b;">Full Name:</span>
            <strong style="color: #0f172a;">${candName}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem;">
            <span style="color: #64748b;">Mobile Number:</span>
            <span>${candPhone}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem;">
            <span style="color: #64748b;">Email Address:</span>
            <span>${candEmail}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem;">
            <span style="color: #64748b;">Total Experience:</span>
            <span>${candExp}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem;">
            <span style="color: #64748b;">Functional Domain:</span>
            <strong style="color: #0284c7;">${candField}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem;">
            <span style="color: #64748b;">Current CTC (Per Annum):</span>
            <span>${candCtc}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem;">
            <span style="color: #64748b;">Preferred Location:</span>
            <span>${candLocation}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem;">
            <span style="color: #64748b;">Attached Resume:</span>
            ${resumeDownloadHtml}
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 0.6rem; padding-top: 0.4rem; border-top: 1px solid #e2e8f0;">
            <span style="color: #64748b;">Sent Directly To:</span>
            <span style="color: #059669; font-weight: 700;">${AVI_PRIMARY_EMAIL}<br><small style="color: #64748b; font-weight: 400;">CC: ${AVI_CC_EMAIL}</small></span>
          </div>
        `;
      }

      const mailtoSubject = encodeURIComponent(emailSubject);
      const mailtoBody = encodeURIComponent(professionalEmailBody);
      if (mailtoBtn) {
        mailtoBtn.href = `mailto:${AVI_PRIMARY_EMAIL}?cc=${AVI_CC_EMAIL}&subject=${mailtoSubject}&body=${mailtoBody}`;
      }

      candForm.reset();
      openModal('modal_submission_success');
    });
  }

});


