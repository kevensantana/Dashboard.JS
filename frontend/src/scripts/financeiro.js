
// pegar dados do finance
const fetchFinance = async () => {
  fetch('/finance/dataFinance')
    .then(response => {
      if (!response.ok) {
          throw new Error('Erro ao buscar dados');
      }
      return response.json();

  })
  .then(data => {
      console.log('Dados recebidos da API:', data); // Log para depuração
      if (!Array.isArray(data) || data.length === 0) {
          // console.error('Nenhum usuário encontrado nos dados recebidos da API');
          return;
      }

      const user = data[1]; // Escolhe o primeiro usuário da lista
      console.log('Usuário selecion: ', user); // Log para depuração
      if (Array.isArray(user.fixedExpenses)) {
          renderExpenses('fixedExpensesTable', user.fixedExpenses);
      } else {
          console.error('Despesas fixas inválidas para o usuário:', user);
      }

      if (Array.isArray(user.variableExpenses)) {
          renderExpenses('variableExpensesTable', user.variableExpenses);
      } else {
          console.error('Despesas variáveis inválidas para o usuário:', user);
      }

      if (Array.isArray(user.savings)) {
          renderSavings(user.savings);
      } else {
          console.error('Economias inválidas para o usuário:', user);
      }

      updateTotals();
  })
  .catch(error => console.error('Erro ao carregar dados:', error));

};

/**
 * 3.1. Renderiza despesas na tabela especificada
 * @param {string} tableId - ID da tabela onde as despesas serão renderizadas
 * @param {Array} expenses - Lista de despesas
 */
function renderExpenses(tableId, expenses) {
  const tableBody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
  tableBody.innerHTML = ''; // Limpar tabela

  if (!Array.isArray(expenses)) {
      console.error(`Esperado um array para despesas, mas recebeu:`, expenses);
      return;
  }

  expenses.forEach(expense => {
      const row = tableBody.insertRow();
      row.setAttribute('data-id', expense.id); // Adiciona o atributo data-id com o ID da despesa
      addExpenseCells(row, expense);
      row.insertCell(6).innerHTML = createActionButtons();
  });
}

/**
 * 3.2. Renderiza economias na tabela de economias
 * @param {Array} savings - Lista de economias
 */
function renderSavings(savings) {
  const tableBody = document.getElementById('savingsTable').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = ''; // Limpar tabela

  if (!Array.isArray(savings)) {
      console.error(`Esperado um array para economias, mas recebeu:`, savings);
      return;
  }

  savings.forEach(saving => {
      const row = tableBody.insertRow();
      addSavingsCells(row, saving);
      row.insertCell(5).innerHTML = createActionButtons();
  });
}


// ================================
// 4. FUNÇÕES AUXILIARES DE RENDERIZAÇÃO
// ================================

/**
 * 4.1. Adiciona células de uma despesa na linha especificada
 * @param {HTMLTableRowElement} row - Linha da tabela
 * @param {Object} expense - Dados da despesa
 */
function addExpenseCells(row, expense) {
  row.insertCell(0).innerText = expense.name;
  row.insertCell(1).innerText = expense.date;
  row.insertCell(2).innerText = `R$: ${parseFloat(expense.price).toFixed(2)}`;
  row.insertCell(3).innerText = expense.installment;
  row.insertCell(4).innerText = expense.paymentDate;
  row.insertCell(5).innerText = expense.percentage;
}

/**
* 4.2. Adiciona células de uma economia na linha especificada
* @param {HTMLTableRowElement} row - Linha da tabela
* @param {Object} saving - Dados da economia
*/
function addSavingsCells(row, saving) {
  const price = parseFloat(saving.price) || 0;
  const goal = parseFloat(saving.goal) || 0;

  row.insertCell(0).innerText = saving.name;
  row.insertCell(1).innerText = saving.date;
  row.insertCell(2).innerText = `R$: ${price.toFixed(2)}`;
  row.insertCell(3).innerText = `R$: ${goal.toFixed(2)}`;
  row.insertCell(4).innerText = `R$: ${(goal - price).toFixed(2)}`;
}

/**
* 4.3. Cria botões de ação para edição e exclusão
* @returns {string} - HTML dos botões
*/
function createActionButtons() {
  return `<button onclick="editExpense(this)"><i class="fas fa-edit"></i></button>
          <button onclick="deleteExpense(this)"><i class="fas fa-trash-alt"></i></button>`;
}

// Navegação de tabelas

(function() {
  const navLinks = document.querySelectorAll('.nav-link:not(.sidebar-nav-link)');
  const sections = document.querySelectorAll('.section');

  if (navLinks.length === 0 || sections.length === 0) {
      console.error("Erro: Não foram encontrados links de navegação ou seções.");
      return;
  }

  navLinks.forEach(link => {
      link.addEventListener('click', (event) => {
          event.preventDefault(); // Evita o comportamento padrão do link
          const targetId = link.getAttribute('data-target');

          if (!targetId) {
              console.error("Erro: O atributo data-target não está definido para um dos links de navegação.", link);
              return;
          }

          const targetSection = document.getElementById(targetId);

          if (!targetSection) {
              console.error(`Erro: Seção alvo com id '${targetId}' não encontrada.`);
              return;
          }

          // Esconde todas as seções
          sections.forEach(section => {
              section.classList.remove('active');
          });

          // Remove a classe 'active' de todos os links
          navLinks.forEach(navLink => {
              navLink.classList.remove('active');
          });

          // Mostra apenas a seção alvo
          targetSection.classList.add('active');

          // Marca o link clicado como ativo
          link.classList.add('active');
      });
  });

  // Mostra a primeira seção por padrão
  if (sections.length > 0) {
      sections[0].classList.add('active');
      navLinks[0].classList.add('active'); // Marca o primeiro link como ativo
  }
})();


// ================================
// 5. FUNÇÕES DE ATUALIZAÇÃO DE TOTAIS
// ================================


// Função para calcular o total de uma tabela
function updateTotals() {
  const fixedTotal = calculateTotal('fixedExpensesTable');
  const variableTotal = calculateTotal('variableExpensesTable');
  const savingsTotal = calculateSavingsTotal();

  document.getElementById('fixedTotal').innerText = `R$: ${fixedTotal.toFixed(2)}`;
  document.getElementById('variableTotal').innerText = `R$: ${variableTotal.toFixed(2)}`;
  document.getElementById('savingsTotal').innerText = `R$: ${savingsTotal.toFixed(2)}`;
  document.getElementById('overallTotal').innerText = `R$: ${(fixedTotal + variableTotal + savingsTotal).toFixed(2)}`;
}


/**
 * 5.2. Calcula o total de despesas de uma tabela
 * @param {string} tableId - ID da tabela
 * @returns {number} - Total calculado
 */
function calculateTotal(tableId) {
  const tableBody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
  let total = 0;
  for (let row of tableBody.rows) {
      total += parseFloat(row.cells[2].innerText.replace('R$: ', ''));
  }
  return total;
}

/**
* 5.3. Calcula o total de economias
* @returns {number} - Total calculado
*/
function calculateSavingsTotal() {
  const tableBody = document.getElementById('savingsTable').getElementsByTagName('tbody')[0];
  let total = 0;
  for (let row of tableBody.rows) {
      total += parseFloat(row.cells[2].innerText.replace('R$: ', ''));
  }
  return total;
}

// Funções genéricas para abrir e fechar popups
function openPopup(popupElement) {
  popupElement.style.display = 'flex';
}

function closePopupFunc(popupElement) {
  popupElement.style.display = 'none';
}

// Event listeners configurados para cada popup
document.addEventListener('DOMContentLoaded', function () {
  const expensePopup = document.getElementById('expensePopup');
  const savingsPopup = document.getElementById('savingsPopup');

  document.getElementById('closeExpensePopup').addEventListener('click', () => closePopupFunc(expensePopup));
  document.getElementById('closeSavingsPopup').addEventListener('click', () => closePopupFunc(savingsPopup));

  addFixedExpenseButton?.addEventListener('click', () => {
      currentExpenseType = 'fixed';
      openPopup(expensePopup);
  });

  addVariableExpenseButton?.addEventListener('click', () => {
      currentExpenseType = 'variable';
      openPopup(expensePopup);
  });

  addSavingsButton?.addEventListener('click', () => openPopup(savingsPopup));
});
;

fetchFinance();
updateTotals();
