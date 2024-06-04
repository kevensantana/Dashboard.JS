/* Função para Carregar Página */
function loadPage(page, style, script, element) {
  // Remover classe 'active' de todos os links
  const links = document.querySelectorAll('.sidebar ul li a');
  links.forEach(link => link.classList.remove('active'));

  // Adicionar classe 'active' ao link clicado
  element.classList.add('active');

  // Carregar conteúdo da página
  fetch(page)
    .then(response => response.text())
    .then(data => {
      document.getElementById('content').innerHTML = data;
      // Carregar CSS da página
      loadStyle(style);
      // Carregar JavaScript da página, se fornecido
      if (script) {
        loadScript(script);
      }
    })
    .catch(error => console.error('Erro ao carregar a página:', error));
}

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

/* Função para Carregar JavaScript */
function loadScript(script) {
  const existingScript = document.getElementById('dynamic-script');
  if (existingScript) {
    existingScript.src = script;
  } else {
    const newScript = document.createElement('script');
    newScript.src = script;
    newScript.id = 'dynamic-script';
    document.body.appendChild(newScript); // Alteração aqui
  }
}


/* Função para Salvar Configurações */
function saveSettings() {
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  alert(`Configurações salvas!\nNome de usuário: ${username}\nEmail: ${email}`);
}

/* Carregar Página Inicial por Padrão */
document.addEventListener('DOMContentLoaded', () => {
  // Carregar página inicial e adicionar classe 'active' ao primeiro link
  const firstLink = document.querySelector('.sidebar ul li a');
  if (firstLink) {
    loadPage('pages/home.html', 'styles/home.css', null, firstLink);
  }
});

/* Carregar Mês e Ano */
document.addEventListener("DOMContentLoaded", function() {
  const currentDateElement = document.getElementById('current-date');
  if (currentDateElement) {
    const now = new Date();
    const options = { year: 'numeric', month: 'long' };
    const formattedDate = now.toLocaleDateString('pt-BR', options);
    currentDateElement.textContent = formattedDate;
  }
});


