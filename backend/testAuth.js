const fetch = global.fetch || require('node-fetch');

const test = async () => {
  const url = 'http://localhost:5000/api/auth/register';
  const payload = {
    fullName: 'Test User',
    email: 'testuser@example.com',
    password: 'Password123',
    college: 'Test College',
    branch: 'Computer Science & Engineering',
    role: 'Software Engineer',
    graduationYear: 2027,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await response.text();
    console.log('STATUS', response.status);
    console.log(text);
  } catch (err) {
    console.error('ERROR', err.message);
  }
};

test();
