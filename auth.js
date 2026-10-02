// Authentication and session management

document.addEventListener('DOMContentLoaded', () => {
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabSignupBtn = document.getElementById('tabSignupBtn');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const authHeading = document.getElementById('authHeading');
  const authMsg = document.getElementById('authMsg');

  const currentUser = JSON.parse(localStorage.getItem('scrapless_user') || 'null');
  if (currentUser) {
    showMessage(`You are currently signed in as ${currentUser.name}. Redirecting to store...`, 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
    return;
  }

  tabLoginBtn.addEventListener('click', () => {
    tabLoginBtn.classList.add('active');
    tabSignupBtn.classList.remove('active');
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    authHeading.textContent = 'Welcome Back';
    hideMessage();
  });

  tabSignupBtn.addEventListener('click', () => {
    tabSignupBtn.classList.add('active');
    tabLoginBtn.classList.remove('active');
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    authHeading.textContent = 'Create an Account';
    hideMessage();
  });

  // Handle login form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      showMessage('Please enter both your email and password.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password.');
      }

      localStorage.setItem('scrapless_user', JSON.stringify(data.user));
      showMessage(`Welcome back, ${data.user.name}! Redirecting...`, 'success');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 700);

    } catch (err) {
      // Fallback for offline or local preview
      const localUsers = JSON.parse(localStorage.getItem('scrapless_users_json') || '[]');
      const defaultDemoUser = {
        name: 'Demo Shopper',
        email: 'user@scrapless.com',
        password: 'password123'
      };

      const allUsers = [defaultDemoUser, ...localUsers];
      const match = allUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (match) {
        const userSession = {
          name: match.name,
          email: match.email,
          loggedInAt: new Date().toISOString()
        };
        localStorage.setItem('scrapless_user', JSON.stringify(userSession));
        showMessage(`Welcome back, ${match.name}! Redirecting...`, 'success');

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 700);
      } else {
        showMessage(err.message || 'Invalid email or password. Please try again.', 'error');
      }
    }
  });

  // Handle registration form submission
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (!name || !email || !password) {
      showMessage('Please fill in all the required fields.', 'error');
      return;
    }

    if (password.length < 6) {
      showMessage('Password must be at least 6 characters long.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      const localUsers = JSON.parse(localStorage.getItem('scrapless_users_json') || '[]');
      localUsers.push({ id: data.user.id, name, email, password });
      localStorage.setItem('scrapless_users_json', JSON.stringify(localUsers));

      localStorage.setItem('scrapless_user', JSON.stringify(data.user));
      showMessage(`Account registered! Welcome, ${data.user.name}. Redirecting...`, 'success');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 700);

    } catch (err) {
      // Fallback for offline or local preview
      const localUsers = JSON.parse(localStorage.getItem('scrapless_users_json') || '[]');
      const exists = localUsers.some(u => u.email.toLowerCase() === email.toLowerCase());

      if (exists || email.toLowerCase() === 'user@scrapless.com') {
        showMessage('An account with this email already exists.', 'error');
        return;
      }

      const newUser = {
        id: `usr_${Date.now()}`,
        name,
        email,
        password,
        createdAt: new Date().toISOString()
      };

      localUsers.push(newUser);
      localStorage.setItem('scrapless_users_json', JSON.stringify(localUsers));

      const userSession = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      };
      localStorage.setItem('scrapless_user', JSON.stringify(userSession));

      showMessage(`Account created! Welcome, ${newUser.name}. Redirecting...`, 'success');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 700);
    }
  });

  function showMessage(text, type) {
    authMsg.textContent = text;
    authMsg.className = `auth-msg ${type}`;
    authMsg.style.display = 'block';
  }

  function hideMessage() {
    authMsg.style.display = 'none';
  }
});
