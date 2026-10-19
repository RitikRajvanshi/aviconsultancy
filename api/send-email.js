const nodemailer = require('nodemailer');

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function generateArialEmailHtml(data) {
  const fields = data.fields || {};
  const isCorporate = (data.formType === 'Corporate Agreement' || data.formType === 'Company Tie-Up' || !!fields.company || !!fields['Organization Name'] || !!fields.coName);
  const isCandidate = !isCorporate;
  const defaultSubject = isCorporate
    ? `[Avi Corporate Tie-Up] ${(fields.company || fields['Organization Name'] || fields.coName || 'Company')} - Agreement Request`
    : 'New Job Application Received | Ritik Rajvanshi | IT & Software Development';
  const subject = escapeHtml(data.subject || defaultSubject);

  const headerIntroText = isCorporate
    ? "A new company tie-up request has been received through the Aviconsultancy website. Please find the company's details below."
    : "A new job application has been received through the Aviconsultancy website. Please find the candidate's details below.";

  let tableRows = '';
  if (isCandidate) {
    const resumeName = data.fileName || (fields.resumeFileName) || 'candidate_resume.pdf';
    const candidateFields = [
      ['Full_Name', fields.fullName || 'Candidate'],
      ['Mobile_Number', fields.mobileNumber || 'N/A'],
      ['Email_Address', fields.emailAddress || 'N/A'],
      ['Total_Experience', fields.totalExperience || 'N/A'],
      ['Functional_Domain', fields.functionalDomain || 'N/A'],
      ['Current_CTC', fields.currentCtc || 'N/A'],
      ['Preferred_Location', fields.preferredLocation || 'N/A'],
      ['Resume_Attachment', resumeName]
    ];
    tableRows = candidateFields.map(([label, val]) => `
      <tr>
        <td style="padding: 10px 14px; font-weight: bold; color: #000000; width: 35%; border: 1px solid #d1d5db; font-family: Arial, Helvetica, sans-serif; font-size: 13.5px; background: #ffffff;">${escapeHtml(label)}</td>
        <td style="padding: 10px 14px; color: #1e293b; border: 1px solid #d1d5db; font-family: Arial, Helvetica, sans-serif; font-size: 13.5px; background: #ffffff;">${
          label === 'Email_Address' ? `<a href="mailto:${encodeURIComponent(val)}" style="color: #2563eb; text-decoration: underline; font-family: Arial, sans-serif;">${escapeHtml(val)}</a>` :
          label === 'Mobile_Number' ? `<a href="tel:${encodeURIComponent(val)}" style="color: #2563eb; text-decoration: underline; font-family: Arial, sans-serif;">${escapeHtml(val)}</a>` : escapeHtml(val)
        }</td>
      </tr>
    `).join('');
  } else {
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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    // Payload abuse prevention
    if (data.fileBase64 && typeof data.fileBase64 === 'string' && data.fileBase64.length > 6 * 1024 * 1024) {
      return res.status(413).json({ success: false, error: 'File size exceeds maximum allowed limit (500 KB).' });
    }

    const isCorporate = (data.formType === 'Corporate Agreement' || data.formType === 'Company Tie-Up' || !!(data.fields && (data.fields.company || data.fields['Organization Name'] || data.fields.coName)));

    const emailHtml = generateArialEmailHtml(data);

    const smtpHost = process.env.SMTP_HOST || 'smtpout.secureserver.net';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
    const smtpUser = process.env.SMTP_USER || 'poojapandey.ceo@aviconsultancy.in';
    const smtpPass = process.env.SMTP_PASS || 'Poojaceo@123';
    const fromHeader = process.env.SMTP_FROM || `"Avi Consultancy" <${smtpUser}>`;

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

    if (data.fileBase64 && data.fileName) {
      try {
        const matches = data.fileBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        const content = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(data.fileBase64, 'base64');
        mailOptions.attachments.push({
          filename: data.fileName.replace(/[^a-zA-Z0-9._-]/g, '_'),
          content: content
        });
      } catch (attErr) {
        console.warn('Error attaching file to email:', attErr);
      }
    }

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
    console.log(`[VERCEL SERVERLESS EMAIL] Sent messageId: ${info.messageId}`);

    return res.status(200).json({
      success: true,
      message: isCorporate ? 'Your corporate recruitment tie-up details have been submitted successfully.' : 'Your CV has been submitted successfully.',
      messageId: info.messageId
    });
  } catch (err) {
    console.error('Serverless send-email error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
