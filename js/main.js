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

  // ==========================================
  // TOAST NOTIFICATION UTILITY
  // ==========================================
  function showToast(title, message, type = 'success', duration = 5000) {
    const container = document.getElementById('toast_container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type === 'error' ? 'error' : ''}`;
    toast.setAttribute('role', 'alert');

    const iconSvg = type === 'error'
      ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>`
      : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>`;

    toast.innerHTML = `
      <div class="toast-icon">
        ${iconSvg}
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button type="button" class="toast-close" aria-label="Close notification">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
      toast.classList.add('hide');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 350);
    };

    if (closeBtn) closeBtn.addEventListener('click', dismiss);
    container.appendChild(toast);

    setTimeout(dismiss, duration);
  }

  async function dispatchEmailNotification(endpointData) {
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(endpointData)
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return { success: false, error: errJson.error || `Server returned ${res.status}` };
      }
      return await res.json();
    } catch (err) {
      console.warn('API dispatch notice:', err);
      return { success: false, error: err.message };
    }
  }

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

    const professionalEmailBody =
`Dear Team,

A new company tie-up request has been received through the Aviconsultancy website. Please find the company's details below.

Agreement_Reference: ${refCode}
Organization_Name: ${coName}
Company_GSTIN: ${coGst}
Registered_Office_Address: ${coAddress}
Coordinator_Name: ${coordName}
Coordinator_Contact: ${coordContact}
Coordinator_Email: ${coordEmail}
Hiring_Industry: ${industry}
Open_Vacancies: ${vacancies}
Commercial_Terms_Agreed: Direct Corporate Engagement | 90-Day Free Replacement Guarantee | Zero Candidate Charges

Best regards,
Team
Aviconsultancy`;

    // Prepare Backend JSON payload
    const endpointData = {
      formType: 'Corporate Agreement',
      subject: `[Avi Corporate Tie-Up] ${coName} - Agreement Request (${refCode})`,
      to: AVI_PRIMARY_EMAIL,
      cc: AVI_CC_EMAIL,
      replyTo: coordEmail,
      ref: refCode,
      emailBody: professionalEmailBody,
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

    const result = await dispatchEmailNotification(endpointData);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origBtnHtml;
    }

    if (result && result.success) {
      const modalAgreement = document.getElementById('modal_agreement_preview');
      if (modalAgreement) closeModal(modalAgreement);
      if (corpForm) corpForm.reset();
      showToast('Agreement Submitted!', 'Your corporate recruitment tie-up details have been submitted successfully.', 'success');
    } else {
      showToast('Submission Notice', (result && result.error) ? `Could not submit: ${result.error}. Please try again or WhatsApp us at +91 63944 91832.` : 'Could not reach server. Please try again or WhatsApp us at +91 63944 91832.', 'error');
    }
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

Full_Name: ${candName}
Mobile_Number: ${candPhone}
Email_Address: ${candEmail}
Total_Experience: ${candExp}
Functional_Domain: ${candField}
Current_CTC: ${candCtc || 'Not specified'}
Preferred_Location: ${candLocation || 'Pan-India'}
Resume/CV: Attached

Best regards,
Team
Aviconsultancy`;

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

      // Send to server API (stores resume in data/resumes, records submission, and dispatches email via Nodemailer)
      try {
        const res = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(endpointData)
        });
        const result = await res.json().catch(() => ({ success: res.ok }));

        if (candSubmitBtn) {
          candSubmitBtn.disabled = false;
          candSubmitBtn.innerHTML = origBtnHtml;
        }

        if (result && result.success) {
          // Close candidate modal, reset form, and clear file status
          const modalCand = document.getElementById('modal_candidate');
          if (modalCand) closeModal(modalCand);
          candForm.reset();

          const resumeStatusEl = document.getElementById('resume_file_status');
          if (resumeStatusEl) {
            resumeStatusEl.textContent = '';
            resumeStatusEl.className = 'form-file-status';
          }

          showToast('Application Submitted!', 'Your CV has been submitted successfully.', 'success');
        } else {
          showToast('Submission Notice', (result && result.error) ? `Could not submit CV: ${result.error}. Please try again.` : 'Could not reach server. Please try again or WhatsApp your CV to +91 63944 91832.', 'error');
        }
      } catch (err) {
        console.warn('API storage notice:', err);
        if (candSubmitBtn) {
          candSubmitBtn.disabled = false;
          candSubmitBtn.innerHTML = origBtnHtml;
        }
        showToast('Network Notice', 'Network connection issue. Please check your internet or WhatsApp your CV to +91 63944 91832.', 'error');
      }
    });
  }

});


