/* ================================================================
 * Funções Utilitárias
 * ================================================================ */

/**
 * Remove a classe 'active' de todos os links da barra lateral.
 */
function removeActiveClass() {
  const links = document.querySelectorAll('.sidebar ul li a, .nav-link');
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
 * @param {Function} callback - Função a ser chamada após o script ser carregado e executado.
 */
function loadScript(script, callback) {
  const existingScript = document.getElementById('dynamic-script');
  if (existingScript) {
    existingScript.remove();
  }
  const newScript = document.createElement('script');
  newScript.src = script;
  newScript.id = 'dynamic-script';
  newScript.onload = callback;
  document.body.appendChild(newScript);
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
      // window.location.href = `${page}`
      document.getElementById('content').innerHTML = data;
      loadStyle(style);


      if (script) {
        loadScript(script, () => {
          console.log(`${script} carregado com sucesso.`);
        });
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
  const username = document.getElementById('username')?.value;
  const email = document.getElementById('email')?.value;
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
    loadPage('../src/pages/home.html', '../src/styles/home.css', '../src/scripts/home.js', firstLink);
  } else {
    console.warn('First sidebar link not found');
  }

  loadCurrentDate();

  // Carregar arquivo de testes apenas em ambiente de desenvolvimento
  if (['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    loadScript('../test/test.js', () => console.log('Script de teste carregado.'));
  }

  // Adicionar evento ao botão de logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = '/';
    });
  } else {
    console.warn('Logout button not found');
  }

  // Adicionar eventos de clique para os links de navegação
  document.querySelectorAll('.sidebar ul li a, .nav-link').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const page = link.getAttribute('data-page');
      const style = link.getAttribute('data-style');
      const script = link.getAttribute('data-script');
      loadPage(page, style, script, link);

    });
  });
});
