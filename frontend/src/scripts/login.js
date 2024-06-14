document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/auth/login' || '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.token) {
      // Armazena o token no localStorage
      localStorage.setItem('token', data.token);
      alert('Login bem-sucedido!');
      // Redirecionar ou carregar a página de perfil
      // loadPage('pages/perfil.html', 'styles/perfil.css', 'scripts/perfil.js', document.querySelector('.sidebar ul li a[href="#perfil"]'));
      window.location.href = '../../views';
    } else {
      alert('Login falhou: ' + data.message);
    }
  })
  .catch(error => console.error('Erro:', error));
});
