const http = require('http');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const PORT = 3000;
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(__dirname, 'data');
const RESUMES_DIR = path.join(DATA_DIR, 'resumes');
const EMAILS_DIR = path.join(DATA_DIR, 'emails');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Ensure directories exist
[DATA_DIR, RESUMES_DIR, EMAILS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Load environment variables from .env
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  const envVars = { ...process.env };
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          envVars[key] = val;
        }
      }
    });
  }
  return envVars;
}

async function sendEmailViaNodemailer(data, savedResume, emailHtml) {
  const env = loadEnv();
  // Default to GoDaddy SMTP
  const smtpHost = env.SMTP_HOST || 'smtpout.secureserver.net';
  const smtpPort = parseInt(env.SMTP_PORT || '465', 10);
  const smtpSecure = env.SMTP_SECURE === 'true' || (env.SMTP_SECURE !== 'false' && smtpPort === 465);
  const smtpUser = env.SMTP_USER || '';
  const smtpPass = env.SMTP_PASS || '';

  // Custom sender from your official domain
  const isCorporate = (data.formType === 'Corporate Agreement' || data.formType === 'Company Tie-Up' || !!(data.fields && (data.fields.company || data.fields['Organization Name'] || data.fields.coName)));
  const fromHeader = env.SMTP_FROM || `"Avi Consultancy" <${smtpUser || 'poojapandey.ceo@aviconsultancy.in'}>`;
  const toEmail = data.to || 'poojapandey.ceo@aviconsultancy.in';
  const ccEmail = data.cc || 'raj.ritik00789@gmail.com';
  const replyTo = data.replyTo || (data.fields && (data.fields.email || data.fields.coordEmail || data.fields.emailAddress)) || 'raj.ritik00789@gmail.com';
  const subject = data.subject || (isCorporate ? '[Avi Corporate Tie-Up] Company Agreement Request' : 'New Job Application Received');

  const defaultTextIntro = isCorporate
    ? "A new company tie-up request has been received through the Aviconsultancy website. Please find the company's details below."
    : "A new job application has been received through the Aviconsultancy website. Please find the candidate's details below.";

  const mailOptions = {
    from: fromHeader,
    to: toEmail,
    cc: ccEmail,
    replyTo: replyTo,
    subject: subject,
    text: data.emailBody || `Dear Team,\n\n${defaultTextIntro}\n\nBest regards,\nTeam\nAviconsultancy`,
    html: emailHtml,
    attachments: []
  };

  if (savedResume && savedResume.path && fs.existsSync(savedResume.path)) {
    mailOptions.attachments.push({
      filename: savedResume.name,
      path: savedResume.path
    });
  }

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const info = await transporter.sendMail(mailOptions);
      console.log(`[NODEMAILER SUCCESS] Message sent via GoDaddy (${smtpHost}): ${info.messageId}`);
      return { success: true, messageId: info.messageId, mode: 'smtp' };
    } catch (sendErr) {
      console.error(`[NODEMAILER ERROR] Failed to send via GoDaddy SMTP (${smtpHost}):`, sendErr.message);
      return { success: false, error: sendErr.message, mode: 'smtp_failed' };
    }
  } else {
    console.log(`\n========================================`);
    console.log(`[EMAIL DISPATCH - LOCAL MODE (NO FORMSUBMIT)]`);
    console.log(`From:       ${fromHeader}`);
    console.log(`To:         ${toEmail}`);
    console.log(`CC:         ${ccEmail}`);
    console.log(`ReplyTo:    ${replyTo}`);
    console.log(`Subject:    ${subject}`);
    if (savedResume) {
      console.log(`Attachment: ${savedResume.name} (${savedResume.path})`);
    }
    console.log(`Typography: Arial, Helvetica, sans-serif`);
    console.log(`Header:     Above table`);
    console.log(`Footer:     Below table`);
    console.log(`Note:       To dispatch directly to live inboxes from local without FormSubmit, add SMTP_USER & SMTP_PASS to .env`);
    console.log(`========================================\n`);
    return { success: true, mode: 'local_saved' };
  }
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.txt': 'text/plain'
};

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function generateArialEmailHtml(data, savedResume) {
  const fields = data.fields || {};
  const isCorporate = (data.formType === 'Corporate Agreement' || data.formType === 'Company Tie-Up' || !!fields.company || !!fields['Organization Name'] || !!fields.coName);
  const isCandidate = !isCorporate;
  const defaultSubject = isCorporate
    ? `[Avi Corporate Tie-Up] ${(fields.company || fields['Organization Name'] || fields.coName || 'Company')} - Agreement Request`
    : 'New Job Application Received | Ritik Rajvanshi | IT & Software Development';
  const subject = escapeHtml(data.subject || defaultSubject);
  const toEmail = data.to || 'poojapandey.ceo@aviconsultancy.in';
  const ccEmail = data.cc || 'raj.ritik00789@gmail.com';
  const replyTo = data.replyTo || (isCorporate ? (fields.email || fields.coordEmail || fields['Coordinator Email'] || 'raj.ritik00789@gmail.com') : (fields.emailAddress || 'raj.ritik00789@gmail.com'));
  const timeIST = data.timestampIST || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const headerIntroText = isCorporate
    ? "A new company tie-up request has been received through the Aviconsultancy website. Please find the company's details below."
    : "A new job application has been received through the Aviconsultancy website. Please find the candidate's details below.";

  let tableRows = '';
  if (isCandidate) {
    const resumeName = (savedResume && savedResume.name) || data.fileName || 'ritik_updated_resume.pdf';
    const candidateFields = [
      ['Full_Name', fields.fullName || 'Ritik Rajvanshi'],
      ['Mobile_Number', fields.mobileNumber || '07272093133'],
      ['Email_Address', fields.emailAddress || 'raj.ritik00789@gmail.com'],
      ['Total_Experience', fields.totalExperience || '3-6 Years'],
      ['Functional_Domain', fields.functionalDomain || 'IT & Software Development'],
      ['Current_CTC', fields.currentCtc || '700000'],
      ['Preferred_Location', fields.preferredLocation || 'Lucknow'],
      ['Resume_Attachment', resumeName]
    ];
    tableRows = candidateFields.map(([label, val]) => `
      <tr>
        <td style="padding: 10px 14px; font-weight: bold; color: #000000; width: 35%; border: 1px solid #d1d5db; font-family: Arial, Helvetica, sans-serif; font-size: 13.5px; background: #ffffff;">${escapeHtml(label)}</td>
        <td style="padding: 10px 14px; color: #1e293b; border: 1px solid #d1d5db; font-family: Arial, Helvetica, sans-serif; font-size: 13.5px; background: #ffffff;">${
          label === 'Email_Address' ? `<a href="mailto:${encodeURIComponent(val)}" style="color: #2563eb; text-decoration: underline; font-family: Arial, sans-serif;">${escapeHtml(val)}</a>` :
          label === 'Mobile_Number' ? `<a href="tel:${encodeURIComponent(val)}" style="color: #2563eb; text-decoration: underline; font-family: Arial, sans-serif;">${escapeHtml(val)}</a>` :
          label === 'Resume_Attachment' && savedResume && savedResume.url ? `<a href="${encodeURI(savedResume.url)}" target="_blank" style="color: #2563eb; text-decoration: underline; font-weight: bold; font-family: Arial, sans-serif;">${escapeHtml(val)}</a>` : escapeHtml(val)
        }</td>
      </tr>
    `).join('');
  } else {
    // Corporate / Company Tie-Up Form Details
    const corpFields = [
      ['Agreement_Reference', data.ref || fields.ref || fields.refCode || fields['Agreement Reference Number'] || `AVI/CORP/${new Date().getFullYear()}`],
      ['Organization_Name', fields.company || fields.coName || fields['Organization Name'] || fields.Organization_Name || 'N/A'],
      ['Company_GSTIN', fields.gst || fields.coGst || fields['Company GSTIN'] || fields.Company_GSTIN || 'N/A'],
      ['Registered_Office_Address', fields.address || fields.coAddress || fields['Registered Office Address'] || fields.Registered_Office_Address || 'N/A'],
      ['Coordinator_Name', fields.coordinator || fields.clientCoordName || fields['Client Coordinator Name'] || fields.Coordinator_Name || 'N/A'],
      ['Coordinator_Contact', fields.contact || fields.coordContact || fields['Coordinator Contact'] || fields.Coordinator_Contact || 'N/A'],
      ['Coordinator_Email', fields.email || fields.coordEmail || fields['Coordinator Email'] || fields.Coordinator_Email || 'N/A'],
      ['Hiring_Industry', fields.industry || fields.jobIndustryField || fields['Hiring Industry / Field'] || fields.Hiring_Industry || 'N/A'],
      ['Open_Vacancies', fields.vacancies || fields.openVacancies || fields['Vacancies Count'] || fields.Open_Vacancies || 'N/A'],
      ['Commercial_Terms_Agreed', fields.terms || fields['Commercial Terms Agreed'] || fields.Commercial_Terms_Agreed || 'Direct Corporate Engagement | 90-Day Free Replacement Guarantee | Zero Candidate Charges']
    ];
    tableRows = corpFields.map(([label, val]) => `
      <tr>
        <td style="padding: 10px 14px; font-weight: bold; color: #000000; width: 35%; border: 1px solid #d1d5db; font-family: Arial, Helvetica, sans-serif; font-size: 13.5px; background: #ffffff;">${escapeHtml(label)}</td>
        <td style="padding: 10px 14px; color: #1e293b; border: 1px solid #d1d5db; font-family: Arial, Helvetica, sans-serif; font-size: 13.5px; background: #ffffff;">${
          label === 'Coordinator_Email' ? `<a href="mailto:${encodeURIComponent(val)}" style="color: #2563eb; text-decoration: underline; font-family: Arial, sans-serif;">${escapeHtml(val)}</a>` :
          label === 'Coordinator_Contact' ? `<a href="tel:${encodeURIComponent(val)}" style="color: #2563eb; text-decoration: underline; font-family: Arial, sans-serif;">${escapeHtml(val)}</a>` : escapeHtml(val)
        }</td>
      </tr>
    `).join('');
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body, table, td, th, p, div, span, h1, h2, h3, a, strong, small {
      font-family: Arial, Helvetica, sans-serif !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 16px; background-color: #f8fafc; font-family: Arial, Helvetica, sans-serif; color: #1e293b; line-height: 1.6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <!-- Main Email Container in Arial Font -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 650px; background: #ffffff; border: 1px solid #d1d5db; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); font-family: Arial, Helvetica, sans-serif;">
          <tr>
            <td style="padding: 4px; font-family: Arial, Helvetica, sans-serif;">

              <!-- Header ABOVE Table -->
              <div style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; color: #1e293b; line-height: 1.6; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; font-family: Arial, Helvetica, sans-serif;">Dear Team,</p>
                <p style="margin: 0; font-family: Arial, Helvetica, sans-serif;">${headerIntroText}</p>
              </div>

              <!-- Information Table -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: 1px solid #d1d5db; margin-bottom: 20px; font-family: Arial, Helvetica, sans-serif;">
                <thead>
                  <tr style="background: #2b4380; color: #ffffff;">
                    <th style="padding: 10px 14px; text-align: left; font-weight: bold; font-size: 14px; border: 1px solid #2b4380; font-family: Arial, Helvetica, sans-serif; width: 35%;">Name</th>
                    <th style="padding: 10px 14px; text-align: left; font-weight: bold; font-size: 14px; border: 1px solid #2b4380; font-family: Arial, Helvetica, sans-serif; width: 65%;">Value</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows}
                </tbody>
              </table>

              <!-- Footer BELOW Table -->
              <div style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #1e293b; line-height: 1.6; margin-top: 20px;">
                <p style="margin: 0 0 2px 0; font-family: Arial, Helvetica, sans-serif;">Best regards,</p>
                <p style="margin: 0 0 2px 0; font-family: Arial, Helvetica, sans-serif; font-weight: bold;">Team</p>
                <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-weight: bold; color: #2b4380;">Aviconsultancy</p>
              </div>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function saveSubmission(submission) {
  try {
    let list = [];
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const content = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
      list = JSON.parse(content || '[]');
    }
    const record = {
      id: 'SUB-' + Date.now(),
      receivedAt: new Date().toISOString(),
      timestampIST: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      ...submission
    };
    list.unshift(record);
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(list, null, 2));
    return record;
  } catch (err) {
    console.error('Error saving submission:', err);
    return null;
  }
}

// Generate an initial default Arial email preview so the preview page works immediately
const defaultEmailHtml = generateArialEmailHtml({
  formType: 'Candidate Application',
  subject: 'New Job Application Received | Ritik Rajvanshi | IT & Software Development',
  to: 'poojapandey.ceo@aviconsultancy.in',
  cc: 'raj.ritik00789@gmail.com',
  fields: {
    fullName: 'Ritik Rajvanshi',
    mobileNumber: '07272093133',
    emailAddress: 'raj.ritik00789@gmail.com',
    totalExperience: '3-6 Years',
    functionalDomain: 'IT & Software Development',
    currentCtc: '700000',
    preferredLocation: 'Lucknow'
  },
  fileName: 'ritik_updated_resume.pdf'
}, null);

fs.writeFileSync(path.join(EMAILS_DIR, 'latest_email.html'), defaultEmailHtml);

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];

  // Route to view the formatted email in Arial font
  if (req.method === 'GET' && (reqPath === '/email-preview' || reqPath === '/latest-email')) {
    const latestFile = path.join(EMAILS_DIR, 'latest_email.html');
    if (fs.existsSync(latestFile)) {
      const htmlContent = fs.readFileSync(latestFile, 'utf8');
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(htmlContent);
      return;
    }
  }

  // API endpoint for form submissions & email notifications
  if (req.method === 'POST' && (reqPath === '/api/send-email' || reqPath === '/api/submit')) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}');

        // Handle uploaded file if present
        let savedResume = null;
        if (data.fileBase64 && data.fileName) {
          try {
            const matches = data.fileBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(data.fileBase64, 'base64');
            const safeName = Date.now() + '_' + path.basename(data.fileName).replace(/[^a-zA-Z0-9._-]/g, '_');
            const targetPath = path.join(RESUMES_DIR, safeName);
            fs.writeFileSync(targetPath, buffer);

            if (!data.fields) data.fields = {};
            data.fields.resumeSavedPath = targetPath;
            data.fields.resumeDownloadUrl = `http://localhost:${PORT}/data/resumes/${safeName}`;
            data.fields.resumeFileSize = (buffer.length / 1024).toFixed(1) + ' KB';
            data.fields.attachmentStatus = 'Successfully Saved to Server & Included in Application';

            savedResume = {
              name: data.fileName,
              size: data.fields.resumeFileSize,
              url: data.fields.resumeDownloadUrl,
              path: targetPath
            };

            // Remove raw base64 string from data object before saving to submissions.json
            delete data.fileBase64;
          } catch (fileErr) {
            console.error('Error saving uploaded resume file:', fileErr);
          }
        }

        // Generate and save HTML email formatted with Arial typography
        const emailHtml = generateArialEmailHtml(data, savedResume);
        fs.writeFileSync(path.join(EMAILS_DIR, 'latest_email.html'), emailHtml);
        fs.writeFileSync(path.join(EMAILS_DIR, `email_${Date.now()}.html`), emailHtml);

        // Send via Nodemailer (with custom sender "Avi Consultancy", exact Header above & Footer below)
        const mailResult = await sendEmailViaNodemailer(data, savedResume, emailHtml);

        const savedRecord = saveSubmission(data);

        const isCorpSub = (data.formType === 'Corporate Agreement' || data.formType === 'Company Tie-Up' || !!(data.fields && (data.fields.company || data.fields['Organization Name'] || data.fields.coName)));
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
          success: true,
          message: isCorpSub ? 'Your corporate recruitment tie-up details have been submitted successfully.' : 'Your CV has been submitted successfully.',
          ref: (savedRecord && savedRecord.id) || ('AVI-' + Date.now()),
          savedResume: savedResume,
          mailResult: mailResult
        }));
      } catch (err) {
        console.error('JSON parse error on /api/send-email:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept'
    });
    res.end();
    return;
  }

  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(PUBLIC_DIR, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Email Preview in Arial Font: http://localhost:${PORT}/email-preview`);
});
