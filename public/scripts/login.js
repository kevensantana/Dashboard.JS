document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          localStorage.setItem('token', data.token);
          window.location.href = 'index.html';
      } else {
          document.getElementById('error-message').textContent = 'Usuário ou senha incorretos';
      }
  })
  .catch(error => {
      console.error('Erro ao fazer login:', error);
  });
});
