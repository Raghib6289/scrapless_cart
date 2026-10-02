// HTTP server and authentication API

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

// Ensure users.json exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(
    USERS_FILE,
    JSON.stringify(
      [
        {
          id: 'usr_1001',
          name: 'Demo Shopper',
          email: 'user@scrapless.com',
          password: 'password123',
          createdAt: new Date().toISOString()
        }
      ],
      null,
      2
    )
  );
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // Register endpoint
  if (pathname === '/api/register' && req.method === 'POST') {
    try {
      const { name, email, password } = await parseBody(req);

      if (!name || !email || !password) {
        return sendJSON(res, 400, { error: 'Name, email, and password are required.' });
      }

      const rawUsers = fs.readFileSync(USERS_FILE, 'utf-8');
      const users = JSON.parse(rawUsers || '[]');

      const normalizedEmail = email.toLowerCase().trim();
      const existingUser = users.find(u => u.email.toLowerCase() === normalizedEmail);

      if (existingUser) {
        return sendJSON(res, 409, { error: 'An account with this email already exists.' });
      }

      const newUser = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password: password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');

      return sendJSON(res, 201, {
        success: true,
        message: 'Account registered successfully.',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt
        }
      });
    } catch (err) {
      console.error('Registration Error:', err);
      return sendJSON(res, 500, { error: 'Internal server error during registration.' });
    }
  }

  // Login endpoint
  if (pathname === '/api/login' && req.method === 'POST') {
    try {
      const { email, password } = await parseBody(req);

      if (!email || !password) {
        return sendJSON(res, 400, { error: 'Please provide both email and password.' });
      }

      const rawUsers = fs.readFileSync(USERS_FILE, 'utf-8');
      const users = JSON.parse(rawUsers || '[]');

      const normalizedEmail = email.toLowerCase().trim();
      const user = users.find(
        u => u.email.toLowerCase() === normalizedEmail && u.password === password
      );

      if (!user) {
        return sendJSON(res, 401, { error: 'Invalid email or password.' });
      }

      return sendJSON(res, 200, {
        success: true,
        message: 'Login successful.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } catch (err) {
      console.error('Login Error:', err);
      return sendJSON(res, 500, { error: 'Internal server error during login.' });
    }
  }

  // Users data endpoint
  if (pathname === '/api/users' && req.method === 'GET') {
    try {
      const rawUsers = fs.readFileSync(USERS_FILE, 'utf-8');
      const users = JSON.parse(rawUsers || '[]');
      const sanitized = users.map(({ password, ...rest }) => rest);
      return sendJSON(res, 200, sanitized);
    } catch (err) {
      return sendJSON(res, 500, { error: 'Failed to read users database.' });
    }
  }

  // Static file serving
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Scrapless Cart server running at http://localhost:${PORT}`);
});
