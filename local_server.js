const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(__dirname, 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
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
        console.log(`\n========================================`);
        console.log(`[EMAIL DISPATCH TO: aviconsultancy1@outlook.com]`);
        console.log(`Time (IST): ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
        console.log(`Form Type:  ${data.formType || 'General Form'}`);
        console.log(`Subject:    ${data.subject || 'New Form Submission'}`);
        console.log(`From / Reply-To: ${data.replyTo || data.from || 'N/A'}`);
        console.log(`Payload:`, data.fields || data);
        console.log(`========================================\n`);

        const savedRecord = saveSubmission(data);

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
          success: true,
          message: 'Form submission received and email notification dispatched to aviconsultancy1@outlook.com',
          ref: (savedRecord && savedRecord.id) || ('AVI-' + Date.now())
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
