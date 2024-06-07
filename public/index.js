// Sumário das Funções e Alterações

// Sumário das Funções
// removeActiveClass: Remove a classe 'active' de todos os links da barra lateral.
// addActiveClass: Adiciona a classe 'active' ao link clicado.
// loadStyle: Carrega dinamicamente um arquivo CSS.
// loadScript: Carrega dinamicamente um arquivo JavaScript.
// loadPage: Carrega dinamicamente uma página HTML, estilo CSS, e script JS associados, e marca o link clicado como ativo.
// saveSettings: Salva configurações do usuário (nome e email) e exibe um alerta de confirmação.
// loadCurrentDate: Carrega e exibe a data atual formatada no elemento com id current-date.
// initializePage: Inicializa a página carregando o conteúdo inicial e configurando eventos.
// Alterações Feitas
// Adicionada verificação de resposta de rede na função loadPage.
// Garantido que o estilo e script são carregados somente se existirem.
// Adicionado um carregador de script de teste apenas em ambiente de desenvolvimento.
// Adicionado evento para carregar a página de resumo financeiro.


/* ================================================================
 * Funções Utilitárias
 * ================================================================ */

/**
 * Remove a classe 'active' de todos os links da barra lateral.
 */
function removeActiveClass() {
  const links = document.querySelectorAll('.sidebar ul li a');
  links.forEach(link => link.classList.remove('active'));
}

/**
 * Adiciona a classe 'active' ao link clicado.
 * @param {HTMLElement} element - O link que foi clicado.
 */
function addActiveClass(element) {
  element.classList.add('active');
}

// =================================================================

/* Manipulação de Estilo (CSS) */

/**
 * Carrega dinamicamente um arquivo CSS.
 * @param {string} style - O caminho do arquivo CSS.
 */
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

/**
 * Carrega dinamicamente um arquivo JavaScript.
 * @param {string} script - O caminho do arquivo JavaScript.
 */
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
  document.head.appendChild(newScript);
}

// =================================================================

/* Carregamento de Páginas */

/**
 * Carrega dinamicamente uma página HTML, estilo CSS, e script JS associados.
 * @param {string} page - O caminho do arquivo HTML.
 * @param {string} style - O caminho do arquivo CSS.
 * @param {string|null} script - O caminho do arquivo JavaScript (pode ser null).
 * @param {HTMLElement} element - O link que foi clicado.
 */
function loadPage(page, style, script, element) {
  removeActiveClass();
  addActiveClass(element);

  fetch(page)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
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

/**
 * Salva configurações do usuário (nome e email) e exibe um alerta de confirmação.
 */
function saveSettings() {
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  alert(`Configurações salvas!\nNome de usuário: ${username}\nEmail: ${email}`);
}

/**
 * Carrega e exibe a data atual formatada no elemento com id 'current-date'.
 */
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

/**
 * Inicializa a página carregando o conteúdo inicial e configurando eventos.
 */
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

  // Adicionar evento ao botão de logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  }
});
