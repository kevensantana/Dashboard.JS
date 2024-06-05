/* Definição de Funções Utilitárias */

/* Função para Remover Classe 'Active' de Todos os Links */
function removeActiveClass() {
  const links = document.querySelectorAll('.sidebar ul li a');
  links.forEach(link => link.classList.remove('active'));
}

/* Função para Adicionar Classe 'Active' ao Link Clicado */
function addActiveClass(element) {
  element.classList.add('active');
}

// =================================================================

/* Manipulação de Estilo (CSS) */

/* Função para Carregar CSS */
function loadStyle(style) {
  const existingLink = document.getElementById('dynamic-style');
  if (existingLink) {
    existingLink.href = style;
  } else {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = style;
    link.id = 'dynamic-style';
    document.head.appendChild(link);
  }
}

// =================================================================


/* Manipulação de Scripts (JS) */

/* Função para Carregar JavaScript */
function loadScript(script) {
  const existingScript = document.getElementById('dynamic-script');
  if (existingScript) {
    existingScript.remove();
  }
  const newScript = document.createElement('script');
  newScript.src = script;
  newScript.id = 'dynamic-script';
  newScript.onload = () => {
    console.log(`${script} carregado com sucesso.`);
  };
  document.body.appendChild(newScript);
}

// =================================================================

/* Carregamento de Páginas */

/* Função para Carregar Página */
function loadPage(page, style, script, element) {
  removeActiveClass();
  addActiveClass(element);

  fetch(page)
    .then(response => response.text())
    .then(data => {
      document.getElementById('content').innerHTML = data;
      loadStyle(style);
      if (script) {
        loadScript(script);
      }
    })
    .catch(error => console.error('Erro ao carregar a página:', error));
}

// =================================================================

/* Configurações e Eventos */

/* Função para Salvar Configurações */
function saveSettings() {
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  alert(`Configurações salvas!\nNome de usuário: ${username}\nEmail: ${email}`);
}

/* Carregar Mês e Ano */
function loadCurrentDate() {
  const currentDateElement = document.getElementById('current-date');
  if (currentDateElement) {
    const now = new Date();
    const options = { year: 'numeric', month: 'long' };
    const formattedDate = now.toLocaleDateString('pt-BR', options);
    currentDateElement.textContent = formattedDate;
  }
}

// =================================================================

/* Inicialização da Página */
document.addEventListener('DOMContentLoaded', () => {
  const firstLink = document.querySelector('.sidebar ul li a');
  if (firstLink) {
    loadPage('pages/home.html', 'styles/home.css', null, firstLink);
  }
  loadCurrentDate();

  // Carregar arquivo de testes apenas em ambiente de desenvolvimento
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    loadScript('test.js');
  }
});

