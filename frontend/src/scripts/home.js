// Função para verificar se o usuário está autenticado
function isAuthenticated() {
  const token = localStorage.getItem('token');
  return token !== null;
}

// Função para buscar o token do localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Função para buscar informações do usuário
function fetchUserInfo() {
  const token = getToken();
  if (!token) {
      return Promise.reject('Token não encontrado');
  }

  return fetch('/auth/user', {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Erro ao buscar informações do usuário');
      }
      return response.json();
  });
}

// Função para atualizar a saudação na página
function updateGreeting(username) {
  document.getElementById('greeting').textContent = `Olá, ${username}`;
}

// Função principal para inicializar a página
function init() {
  if (!isAuthenticated()) {
      window.location.href = '/'; // Redirecionar para a página de login se não estiver autenticado
      return;
  }

  fetchUserInfo()
  .then(data => {
      if (data.success) {
          updateGreeting(data.user.username);
      } else {
          window.location.href = '/'; // Redirecionar para a página de login em caso de erro
      }
  })
  .catch(error => {
      console.error('Erro ao buscar informações do usuário:', error);
      window.location.href = '/'; // Redirecionar para a página de login em caso de erro
  });
}

// Inicializar a página quando o script for carregado
init();
