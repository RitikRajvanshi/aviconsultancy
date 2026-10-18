const http = require('http');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('--- RUNNING AUTOMATED VERIFICATION ON LOCALHOST:3000 ---');
  const html = await fetchUrl('http://localhost:3000');

  // Test 1: Button text
  const candBtnMatch = html.match(/id="btn_submit_candidate"[^>]*>([\s\S]*?)<\/button>/);
  if (!candBtnMatch) {
    console.error('FAIL: Candidate submit button not found');
  } else {
    const text = candBtnMatch[1].trim();
    if (text === 'Submit') {
      console.log('PASS: Candidate form submit button text is exactly "Submit"');
    } else {
      console.error(`FAIL: Candidate form submit button text is "${text}", expected "Submit"`);
    }
  }

  const agreeBtnMatch = html.match(/id="btn_submit_agreement"[^>]*>([\s\S]*?)<\/button>/);
  if (!agreeBtnMatch) {
    console.error('FAIL: Agreement submit button not found');
  } else {
    const text = agreeBtnMatch[1].trim();
    if (text === 'Submit') {
      console.log('PASS: Agreement form submit button text is exactly "Submit"');
    } else {
      console.error(`FAIL: Agreement form submit button text is "${text}", expected "Submit"`);
    }
  }

  // Test 2: Max 500 KB and PDF accept in HTML
  if (html.includes('max 500 KB') && html.includes('accept=".pdf,application/pdf"')) {
    console.log('PASS: PDF 500 KB limit and .pdf accept attribute present in input');
  } else {
    console.error('FAIL: PDF 500 KB label or accept attribute missing');
  }

  // Test 3: Top notice bar check
  const topNoticeMatch = html.match(/class="top-notice-bar"[\s\S]*?<\/div>\s*<\/div>/);
  if (topNoticeMatch) {
    const topBar = topNoticeMatch[0];
    const hasHubs = /Lucknow|Ayodhya|NCR|Mumbai/i.test(topBar);
    if (!hasHubs) {
      console.log('PASS: Top header bar contains no office hub names (only clean motto)');
    } else {
      console.error('FAIL: Top header bar still contains hub names!');
    }
  }

  // Test 4: Hubs order check in about section
  const aboutLocGridMatch = html.match(/class="office-locations-grid"[\s\S]*?<\/div>\s*<\/div>/);
  if (aboutLocGridMatch) {
    const gridText = aboutLocGridMatch[0];
    const idxLko = gridText.indexOf('Lucknow (Head Office)');
    const idxAyo = gridText.indexOf('Ayodhya');
    const idxNcr = gridText.indexOf('NCR');
    const idxMum = gridText.indexOf('Mumbai');
    if (idxLko !== -1 && idxAyo > idxLko && idxNcr > idxAyo && idxMum > idxNcr) {
      console.log('PASS: Office locations grid order is strictly Lucknow -> Ayodhya -> NCR -> Mumbai');
    } else {
      console.error('FAIL: Office locations grid order mismatch:', { idxLko, idxAyo, idxNcr, idxMum });
    }
  }

  // Test 5: Verify main.js validation functions logic directly
  const mainJs = await fetchUrl('http://localhost:3000/js/main.js');
  
  // Create sandbox to test validateMobile, validateEmail, validateResumeFile
  const vm = require('vm');
  const context = {
    document: {
      addEventListener: () => {},
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => []
    },
    window: {},
    console: { log: () => {}, warn: () => {} }
  };
  vm.createContext(context);
  
  // Extract and eval the validation functions
  const validationCodeMatch = mainJs.match(/function validateMobile[\s\S]*?function setFieldError/);
  if (!validationCodeMatch) {
    console.error('FAIL: Could not locate validation functions in main.js');
  } else {
    const codeToEval = validationCodeMatch[0].replace('function setFieldError', '');
    vm.runInContext(codeToEval, context);

    // Test validateMobile
    const testPhones = [
      { input: '9876543210', expected: true, desc: '10 digit standard' },
      { input: '+919876543210', expected: true, desc: '+91 12 digits' },
      { input: '+91 98765 43210', expected: true, desc: '+91 formatted 12 digits' },
      { input: '09876543210', expected: true, desc: '0 leading 11 digits' },
      { input: '987654321', expected: false, desc: '9 digits (too short)' },
      { input: '98765432101234', expected: false, desc: '14 digits (too long)' },
      { input: '98765abc123', expected: false, desc: 'letters in phone' },
      { input: '', expected: false, desc: 'empty phone' }
    ];

    let phoneAllPassed = true;
    for (const t of testPhones) {
      const res = context.validateMobile(t.input);
      if (res.valid !== t.expected) {
        console.error(`FAIL: Phone "${t.input}" (${t.desc}) expected valid=${t.expected}, got ${res.valid}`);
        phoneAllPassed = false;
      }
    }
    if (phoneAllPassed) console.log('PASS: All 8 validateMobile scenarios passed (10-13 digits strictly enforced)');

    // Test validateEmail
    const testEmails = [
      { input: 'user@example.com', expected: true },
      { input: 'poojapandey.ceo@aviconsultancy.in', expected: true },
      { input: 'invalid-email', expected: false },
      { input: 'test@', expected: false },
      { input: '@domain.com', expected: false },
      { input: 'test@domain', expected: false },
      { input: '', expected: false }
    ];
    let emailAllPassed = true;
    for (const t of testEmails) {
      const res = context.validateEmail(t.input);
      if (res.valid !== t.expected) {
        console.error(`FAIL: Email "${t.input}" expected valid=${t.expected}, got ${res.valid}`);
        emailAllPassed = false;
      }
    }
    if (emailAllPassed) console.log('PASS: All 7 validateEmail scenarios passed');

    // Test validateResumeFile
    const testFiles = [
      { file: { name: 'resume.pdf', type: 'application/pdf', size: 150 * 1024 }, expected: true, desc: '150KB PDF' },
      { file: { name: 'resume.pdf', type: 'application/pdf', size: 500 * 1024 }, expected: true, desc: '500KB PDF exact limit' },
      { file: { name: 'resume.pdf', type: 'application/pdf', size: 501 * 1024 }, expected: false, desc: '501KB PDF (over 500KB)' },
      { file: { name: 'resume.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 100 * 1024 }, expected: false, desc: 'DOCX file' },
      { file: { name: 'photo.jpg', type: 'image/jpeg', size: 50 * 1024 }, expected: false, desc: 'JPG file' },
      { file: null, expected: false, desc: 'No file' }
    ];
    let fileAllPassed = true;
    for (const t of testFiles) {
      const res = context.validateResumeFile(t.file);
      if (res.valid !== t.expected) {
        console.error(`FAIL: Resume File (${t.desc}) expected valid=${t.expected}, got ${res.valid}`);
        fileAllPassed = false;
      }
    }
    if (fileAllPassed) console.log('PASS: All 6 validateResumeFile scenarios passed (Strictly PDF <= 500 KB)');
  }

  console.log('--- ALL AUTOMATED VERIFICATIONS COMPLETE ---');
}

runTests().catch(console.error);
