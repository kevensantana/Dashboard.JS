document.addEventListener('DOMContentLoaded', () => {
  // Teste de remoção de classe 'active'
  console.log("Teste de Remoção de Classe 'Active':");
  removeActiveClass();
  const links = document.querySelectorAll('.sidebar ul li a');
  links.forEach(link => console.assert(!link.classList.contains('active'), 'Erro: A classe active não foi removida'));

  // Teste de adição de classe 'active'
  console.log("Teste de Adição de Classe 'Active':");
  if (links.length > 0) {
    addActiveClass(links[0]);
    console.assert(links[0].classList.contains('active'), 'Erro: A classe active não foi adicionada');
  }
  
  // Teste de carregamento de estilo
  console.log("Teste de Carregamento de Estilo:");
  loadStyle('styles/test.css');
  console.assert(document.getElementById('dynamic-style').href.includes('styles/test.css'), 'Erro: O estilo não foi carregado corretamente');
  
  // Teste de carregamento de script
  console.log("Teste de Carregamento de Script:");
  loadScript('scripts/test.js');
  console.assert(document.getElementById('dynamic-script').src.includes('scripts/test.js'), 'Erro: O script não foi carregado corretamente');

  // Teste de carregamento de página
  console.log("Teste de Carregamento de Página:");
  loadPage('pages/test.html', 'styles/test.css', 'scripts/test.js', links[0]);
});
