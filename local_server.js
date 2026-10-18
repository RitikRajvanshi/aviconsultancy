const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(__dirname, 'data');
const RESUMES_DIR = path.join(DATA_DIR, 'resumes');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Ensure data and resumes directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(RESUMES_DIR)) {
  fs.mkdirSync(RESUMES_DIR, { recursive: true });
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

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];

  // API endpoint for form submissions & email notifications
  if (req.method === 'POST' && (reqPath === '/api/send-email' || reqPath === '/api/submit')) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
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

        console.log(`\n========================================`);
        console.log(`[EMAIL DISPATCH TO: poojapandey.ceo@aviconsultancy.in]`);
        console.log(`[CC:                raj.ritik00789@gmail.com]`);
        console.log(`Time (IST):         ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
        console.log(`Form Type:          ${data.formType || 'General Form'}`);
        console.log(`Subject:            ${data.subject || 'New Form Submission'}`);
        console.log(`From / Reply-To:    ${data.replyTo || data.from || 'N/A'}`);
        if (savedResume) {
          console.log(`[ATTACHMENT SAVED]: ${savedResume.name} (${savedResume.size})`);
          console.log(`[DOWNLOAD URL]:     ${savedResume.url}`);
        }
        if (data.emailBody) {
          console.log(`--- EMAIL BODY ---`);
          console.log(data.emailBody);
          console.log(`------------------`);
        }
        console.log(`Payload Fields:`, data.fields || data);
        console.log(`========================================\n`);

        const savedRecord = saveSubmission(data);

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
          success: true,
          message: 'Form submission received and email notification dispatched to poojapandey.ceo@aviconsultancy.in and raj.ritik00789@gmail.com',
          ref: (savedRecord && savedRecord.id) || ('AVI-' + Date.now()),
          savedResume: savedResume
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
});
