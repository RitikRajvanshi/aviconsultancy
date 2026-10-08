/**
 * Anoop Consultancy - Interactive Web Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCalculator();
  initTopicsDirectory();
  initFAQ();
  initModal();
  initLeadForm();
});

/* ==========================================================================
   1. Navbar & Mobile Drawer
   ========================================================================== */
function initNavbar() {
  const headerWrapper = document.querySelector('.site-header-wrapper');
  const header = document.querySelector('.header-nav');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      if (headerWrapper) headerWrapper.classList.add('scrolled');
      if (header) header.classList.add('scrolled');
    } else {
      if (headerWrapper) headerWrapper.classList.remove('scrolled');
      if (header) header.classList.remove('scrolled');
    }
  });

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      mobileBtn.innerHTML = isOpen ? '&#10005;' : '&#9776;';
    });

    // Close when clicking nav links or buttons inside drawer
    mobileDrawer.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileBtn.innerHTML = '&#9776;';
      });
    });
  }
}

/* ==========================================================================
   2. Interactive Project Price & Timeline Calculator
   ========================================================================== */
const COURSE_BASE_RATES = {
  mba: { name: 'MBA / PGDM Project', base: 4500, time: 7 },
  phd: { name: 'PhD Thesis / Synopsis', base: 9500, time: 14 },
  bms: { name: 'BMS / BBA Project', base: 2800, time: 5 },
  bcom: { name: 'B.Com / M.Com Project', base: 2200, time: 4 },
  content: { name: 'SEO & Web Content', base: 3000, time: 4 }
};

const SCOPE_MULTIPLIERS = {
  full: { name: 'Complete Thesis (End-to-End)', multiplier: 1.0 },
  synopsis: { name: 'Synopsis & Proposal Only', multiplier: 0.45 },
  spss: { name: 'Data Analysis & SPSS Stats', multiplier: 0.65 },
  ppt: { name: 'Viva Defense PPT & Summary', multiplier: 0.35 }
};

function initCalculator() {
  const courseInputs = document.querySelectorAll('input[name="calc_course"]');
  const scopeInputs = document.querySelectorAll('input[name="calc_scope"]');
  const urgencySlider = document.getElementById('calc_urgency');
  const urgencyValLabel = document.getElementById('urgency_val');
  
  const priceDisplay = document.getElementById('calc_price_output');
  const turnaroundDisplay = document.getElementById('calc_time_output');
  const whatsappCalcBtn = document.getElementById('calc_whatsapp_btn');

  function calculateQuote() {
    let selectedCourse = 'mba';
    courseInputs.forEach(i => { if (i.checked) selectedCourse = i.value; });

    let selectedScope = 'full';
    scopeInputs.forEach(i => { if (i.checked) selectedScope = i.value; });

    const urgencyDays = parseInt(urgencySlider.value, 10);
    urgencyValLabel.textContent = `${urgencyDays} Days`;

    const courseData = COURSE_BASE_RATES[selectedCourse] || COURSE_BASE_RATES.mba;
    const scopeData = SCOPE_MULTIPLIERS[selectedScope] || SCOPE_MULTIPLIERS.full;

    let calculatedPrice = Math.round(courseData.base * scopeData.multiplier);
    
    // Rush multiplier if urgent
    if (urgencyDays <= 3) {
      calculatedPrice = Math.round(calculatedPrice * 1.35);
    } else if (urgencyDays <= 5) {
      calculatedPrice = Math.round(calculatedPrice * 1.15);
    }

    const priceMin = Math.round(calculatedPrice * 0.9);
    const priceMax = Math.round(calculatedPrice * 1.1);

    if (priceDisplay) {
      priceDisplay.textContent = `₹${priceMin.toLocaleString('en-IN')} – ₹${priceMax.toLocaleString('en-IN')}`;
    }

    if (turnaroundDisplay) {
      turnaroundDisplay.textContent = `Estimated Delivery: Guaranteed within ${urgencyDays} Days`;
    }

    if (whatsappCalcBtn) {
      const message = `Hello Anoop Consultancy, I calculated a quote on your website for: ${courseData.name} (${scopeData.name}) with required delivery in ${urgencyDays} days. Please guide me on getting started.`;
      const encoded = encodeURIComponent(message);
      whatsappCalcBtn.href = `https://wa.me/919820000000?text=${encoded}`;
    }
  }

  courseInputs.forEach(i => i.addEventListener('change', calculateQuote));
  scopeInputs.forEach(i => i.addEventListener('change', calculateQuote));
  if (urgencySlider) {
    urgencySlider.addEventListener('input', calculateQuote);
  }

  calculateQuote();
}

/* ==========================================================================
   3. Searchable Academic Project Topics Directory
   ========================================================================== */
const PROJECT_TOPICS = [
  {
    id: 1,
    domain: 'finance',
    level: 'MBA / PhD',
    title: 'Impact of Digital Banking & UPI on Customer Retention in Mumbai Public vs Private Banks',
    description: 'Empirical study with SPSS regression analysis evaluating convenience, cyber-trust, and transaction speed across 250 respondents.',
    tags: ['Fintech', 'SPSS', 'Banking']
  },
  {
    id: 2,
    domain: 'marketing',
    level: 'MBA Marketing',
    title: 'Consumer Perception & Purchase Intent Towards Quick-Commerce Platforms (Blinkit, Zepto, Instamart)',
    description: 'Analyzing impulse buying behavior, delivery expectations, and subscription models in urban Tier-1 markets.',
    tags: ['Q-Commerce', 'Consumer Behavior', 'Brand Loyalty']
  },
  {
    id: 3,
    domain: 'hr',
    level: 'MBA HR / BMS',
    title: 'Effectiveness of Hybrid Work Policies on Employee Burnout and Attrition in IT Consultancies',
    description: 'Work-life balance metrics, manager communication frequency, and retention policies in Navi Mumbai tech parks.',
    tags: ['Hybrid Work', 'Employee Engagement', 'HR Strategy']
  },
  {
    id: 4,
    domain: 'operations',
    level: 'MBA Operations',
    title: 'Supply Chain Resiliency & Cold-Chain Logistics in Indian Pharmaceutical Exports',
    description: 'Optimization study covering inventory buffer stocks, temperature tracking IoT, and port clearance bottlenecks.',
    tags: ['Supply Chain', 'Pharma', 'Logistics']
  },
  {
    id: 5,
    domain: 'finance',
    level: 'PhD / M.Com',
    title: 'Comparative Performance Analysis of ESG Mutual Funds vs Benchmark Nifty 50 Indices (2018–2025)',
    description: 'Sharpe ratio, Jensen alpha, and Treynor index risk-adjusted return evaluation over 7 years.',
    tags: ['ESG', 'Portfolio Management', 'Capital Markets']
  },
  {
    id: 6,
    domain: 'it',
    level: 'BMS / MBA IT',
    title: 'Adoption Challenges of Generative AI Tools in Small & Medium Enterprises (SMEs) in Maharashtra',
    description: 'Assessment of cost, data privacy compliance, and workforce skilling across 120 Mumbai business owners.',
    tags: ['Artificial Intelligence', 'SME Business', 'Digital Transformation']
  },
  {
    id: 7,
    domain: 'marketing',
    level: 'MBA / BMS',
    title: 'Influencer Marketing ROI: Micro-Influencers vs Celebrity Endorsements for D2C Beauty Brands',
    description: 'Survey on engagement rate, authenticity perception, and conversion metrics among Gen-Z college students.',
    tags: ['Social Media', 'D2C', 'Influencer ROI']
  },
  {
    id: 8,
    domain: 'hr',
    level: 'MBA HR',
    title: 'Talent Acquisition Evolution: AI-Driven Resume Screening vs Human Intuition in BFSI Sector',
    description: 'Comparative case study assessing interview conversion, diversity outcomes, and hiring turnaround time.',
    tags: ['AI in HR', 'Recruitment', 'BFSI']
  }
];

function initTopicsDirectory() {
  const container = document.getElementById('topics_grid');
  const tabs = document.querySelectorAll('.topic-tab-btn');
  const searchInput = document.getElementById('topic_search_input');

  let activeDomain = 'all';
  let searchQuery = '';

  function renderTopics() {
    if (!container) return;

    const filtered = PROJECT_TOPICS.filter(item => {
      const matchDomain = (activeDomain === 'all' || item.domain === activeDomain);
      const matchSearch = (
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery) ||
        item.description.toLowerCase().includes(searchQuery) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery))
      );
      return matchDomain && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1;">
          <h4 style="font-size: 1.25rem; color: #0b2545; margin-bottom: 8px;">No matching project topics found</h4>
          <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 20px;">Have a custom or unique topic from your university guide? We can consult on any syllabus.</p>
          <button class="btn btn-primary btn-sm open-modal-btn" data-topic="Custom University Topic">Request Custom Topic Consultation</button>
        </div>
      `;
      bindModalButtons();
      return;
    }

    container.innerHTML = filtered.map(item => `
      <div class="topic-card" data-domain="${item.domain}">
        <div>
          <div class="topic-badge-row">
            <span class="topic-domain-tag">${item.domain}</span>
            <span class="topic-level-tag">${item.level}</span>
          </div>
          <h4 class="topic-card-title">${item.title}</h4>
          <p class="topic-card-desc">${item.description}</p>
        </div>
        <div class="topic-card-footer">
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            ${item.tags.map(t => `<span style="font-size: 0.75rem; background: #e2e8f0; padding: 2px 8px; border-radius: 4px; color: #475569;">#${t}</span>`).join('')}
          </div>
          <button class="btn btn-outline btn-sm open-modal-btn" data-topic="${item.title}">
            Request Synopsis &rarr;
          </button>
        </div>
      </div>
    `).join('');

    bindModalButtons();
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeDomain = tab.getAttribute('data-domain');
      renderTopics();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderTopics();
    });
  }

  renderTopics();
}

/* ==========================================================================
   4. FAQ Accordion
   ========================================================================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other items
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherBody = other.querySelector('.faq-body');
        if (otherBody) otherBody.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   5. Lead Modal & Popups
   ========================================================================== */
function initModal() {
  const overlay = document.getElementById('quote_modal');
  const closeBtn = document.querySelector('.modal-close-btn');

  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  }

  bindModalButtons();
}

function bindModalButtons() {
  const overlay = document.getElementById('quote_modal');
  const modalTopicField = document.getElementById('modal_topic_input');
  const openButtons = document.querySelectorAll('.open-modal-btn');

  openButtons.forEach(btn => {
    btn.removeEventListener('click', handleModalOpen);
    btn.addEventListener('click', handleModalOpen);
  });

  function handleModalOpen(e) {
    e.preventDefault();
    const topic = this.getAttribute('data-topic');
    if (modalTopicField && topic) {
      modalTopicField.value = topic;
    }
    if (overlay) {
      overlay.classList.add('active');
    }
  }
}

/* ==========================================================================
   6. Lead Form Submissions with Confirmation
   ========================================================================== */
function initLeadForm() {
  const forms = [
    document.getElementById('contact_form'),
    document.getElementById('modal_quote_form')
  ];

  forms.forEach(form => {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Submitting Request...';

      setTimeout(() => {
        submitBtn.innerHTML = '&#10003; Inquiry Received! We will WhatsApp you within 15 mins';
        submitBtn.style.background = '#10b981';

        setTimeout(() => {
          form.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          const modal = document.getElementById('quote_modal');
          if (modal) modal.classList.remove('active');
        }, 3500);
      }, 900);
    });
  });
}
