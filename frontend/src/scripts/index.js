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

/* Manipulação de Estilo (CSS) */

/**
 * Carrega dinamicamente um arquivo CSS.
 * @param {string} style - O caminho do arquivo CSS.
 */
function loadStyle(style) {
  let link = document.getElementById('dynamic-style');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.id = 'dynamic-style';
    document.head.appendChild(link);
  }
  link.href = style;
}

// =================================================================
const loadedScripts = new Set();

/**
 * Carrega dinamicamente um arquivo JavaScript.
 * @param {string} script - O caminho do arquivo JavaScript.
 * @param {Function} callback - Função a ser chamada após o script ser carregado e executado.
 * @param {boolean} forceReload - Se true, força a recarga do script.
 */
function loadScript(script, callback, forceReload = false) {
  if (!forceReload && loadedScripts.has(script)) {
    // Script já está carregado e recarregamento não é forçado
    if (callback) callback();
    return;
  }

  // Remove script existente se já estiver carregado
  const existingScript = document.querySelector(`script[src="${script}"]`);
  if (existingScript) {
    existingScript.remove();
  }

  const newScript = document.createElement('script');
  newScript.src = script;
  newScript.id = 'dynamic-script';
  newScript.onload = () => {
    loadedScripts.add(script);
    if (callback) callback();
  };
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
 * @param {boolean} forceReloadScript - Se true, força a recarga do script.
 */
function loadPage(page, style, script, element, forceReloadScript = false) {
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
        loadScript(script, () => {
          console.log(`${script} carregado com sucesso.`);
        }, forceReloadScript);
      }
    })
    .catch(error => console.error('Erro ao carregar a página:', error));
}

// =================================================================

/* Inicialização da Página */

/**
 * Inicializa a página carregando o conteúdo inicial e configurando eventos.
 */
function initializePage() {
  const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
  const sidebar = document.querySelector('.sidebar');
  
  if (toggleSidebarBtn && sidebar) {
    toggleSidebarBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  } else {
    console.warn('Sidebar toggle button or sidebar not found');
  }

  const firstLink = document.querySelector('.sidebar ul li a');
  if (firstLink) {
    loadPage(firstLink.dataset.page, firstLink.dataset.style, firstLink.dataset.script, firstLink);
  } else {
    console.warn('First sidebar link not found');
  }

  loadCurrentDate();

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = '/';
    });
  } else {
    console.warn('Logout button not found');
  }

  document.querySelectorAll('.sidebar ul li a, .nav-link').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const page = link.dataset.page;
      const style = link.dataset.style;
      const script = link.dataset.script;
      loadPage(page, style, script, link, true);
    });
  });
}

// Chamar a função de inicialização da página
initializePage();
