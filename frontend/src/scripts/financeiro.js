
// pegar dados do finance
function fetchFinance() {
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

            const user = data[0]; // Escolhe o primeiro usuário da lista
            console.log('Usuário selecionado: ', user); // Log para depuração

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
}

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
* Formata a data para exibir apenas o dia e o mês
* @param {string} dateString - String de data a ser formatada
* @returns {string} - Data formatada como "dd/mm"
*/
function formatDate(dateString) {
 const options = { day: '2-digit', month: '2-digit' };
 const date = new Date(dateString);
 return date.toLocaleDateString('pt-BR', options);
}
/**
 * Adiciona células de uma despesa na linha especificada
 * @param {HTMLTableRowElement} row - Linha da tabela onde serão adicionadas as células
 * @param {Object} expense - Dados da despesa
 */
function addExpenseCells(row, expense) {
  const { name, date, price, installment, paymentDate, percentage } = expense;
  const formattedPrice = `R$: ${parseFloat(price || 0).toFixed(2)}`;

  row.insertCell(0).innerText = name || '';
  row.insertCell(1).innerText = formatDate(date) || '';
  row.insertCell(2).innerText = formattedPrice;
  row.insertCell(3).innerText = installment || '';
  row.insertCell(4).innerText = paymentDate || '';
  row.insertCell(5).innerText = percentage || '';
}

/**
 * Adiciona células de uma economia na linha especificada
 * @param {HTMLTableRowElement} row - Linha da tabela onde serão adicionadas as células
 * @param {Object} saving - Dados da economia
 */
function addSavingsCells(row, saving) {
  const { name, date, price, goal } = saving;
  const formattedPrice = `R$: ${parseFloat(price || 0).toFixed(2)}`;
  const formattedGoal = `R$: ${parseFloat(goal || 0).toFixed(2)}`;
  const difference = `R$: ${(parseFloat(goal || 0) - parseFloat(price || 0)).toFixed(2)}`;

  row.insertCell(0).innerText = name || '';
  row.insertCell(1).innerText = formatDate(date) || '';
  row.insertCell(2).innerText = formattedPrice;
  row.insertCell(3).innerText = formattedGoal;
  row.insertCell(4).innerText = difference;
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


// ================================
// 9. EVENT LISTENERS
// ================================

// Funções para manipulação de popups
function openPopup(popupElement) {
  popupElement.style.display = 'flex';
}

function closePopup(popupElement) {
  popupElement.style.display = 'none';
}

// Funções para configurar os popups
function setupExpensePopup() {
  const expensePopup = document.getElementById('expensePopup');
  const closeExpensePopup = document.getElementById('closeExpensePopup');
  const addFixedExpenseButton = document.getElementById('addFixedExpenseButton');
  const addVariableExpenseButton = document.getElementById('addVariableExpenseButton');
  const saveExpenseButton = document.getElementById('saveExpenseButton');
  const cancelExpenseButton = document.getElementById('cancelExpenseButton');

  addFixedExpenseButton?.addEventListener('click', () => {
      currentExpenseType = 'fixed';
      openPopup(expensePopup);
  });

  addVariableExpenseButton?.addEventListener('click', () => {
      currentExpenseType = 'variable';
      openPopup(expensePopup);
  }); 

  saveExpenseButton?.addEventListener('click', () => {
      const saveData = addExpense(currentExpenseType);
      saveData();
      closePopup(expensePopup);
  });

  cancelExpenseButton?.addEventListener('click', () => closePopup(expensePopup));
  closeExpensePopup?.addEventListener('click', () => closePopup(expensePopup));
}

function setupSavingsPopup() {
  const savingsPopup = document.getElementById('savingsPopup');
  const closeSavingsPopup = document.getElementById('closeSavingsPopup');
  const addSavingsButton = document.getElementById('addSavingsButton');
  const saveSavingsButton = document.getElementById('saveSavingsButton');
  const cancelSavingsButton = document.getElementById('cancelSavingsButton');

  addSavingsButton?.addEventListener('click', () => openPopup(savingsPopup));

  saveSavingsButton?.addEventListener('click', () => {
      const saveData = addSavings();
      saveData();
      closePopup(savingsPopup);
  });

  cancelSavingsButton?.addEventListener('click', () => closePopup(savingsPopup));
  closeSavingsPopup?.addEventListener('click', () => closePopup(savingsPopup));
}

// Configurar todos os popups
function setupPopups() {
  setupExpensePopup();
  setupSavingsPopup();
}

/**
 * 8.1. Função para adicionar uma nova despesa
 * @param {string} expenseType - Tipo de despesa ('fixed' ou 'variable')
 */
// Função para adicionar despesa
function addExpense(expenseType) {
  const table = document.getElementById(expenseType === 'fixed' ? 'fixedExpensesTable' : 'variableExpensesTable').getElementsByTagName('tbody')[0];
  
  const row = table.insertRow();
  
  for (let i = 0; i < 7; i++) {
      const cell = row.insertCell(i);
      if (i < 6) {
          cell.contentEditable = 'true';
      } else {
          cell.innerHTML = createActionButtons();
      }
  }
  
  // Função para salvar os dados
  const saveData = () => {
      // Obter valores dos campos de input
      const name = document.getElementById('expenseName').value || '';
      const date = document.getElementById('expenseDate').value || '';
      const price = document.getElementById('expensePrice').value || '';
      const installment = document.getElementById('expenseInstallment').value || '';
      const paymentDate = document.getElementById('paymentDate').value || '';
      const percentage = '0%'; // Valor padrão, já que não há um input correspondente
      
      const newExpense = { expenseType, name, date, price, installment, paymentDate, percentage };
      
      // Log dos dados antes de enviar
      console.log('Dados da nova despesa:', newExpense);
      
      // Inserir valores na tabela
      row.cells[0].innerText = newExpense.name;
      row.cells[1].innerText = newExpense.date;
      row.cells[2].innerText = `R$: ${newExpense.price}`;
      row.cells[3].innerText = newExpense.installment;
      row.cells[4].innerText = newExpense.paymentDate;
      row.cells[5].innerText = newExpense.percentage;
        
      // Enviar dados para o backend
      fetch('/finance/addExpense', {
          method: 'POST ',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(newExpense),
      })
      .then(response => {
          if (!response.ok) {
              return response.json().then(errorData => {
                  throw new Error(errorData.message || 'Erro ao adicionar despesa');
              });
          }
          return response.json();
      })
      .then(data => {
          console.log('Despesa adicionada com sucesso:', data);
          updateTotals();
      })
      .catch(error => {
          console.error('Erro ao adicionar despesa:', error);
      });
      
      updateTotals();
  };

  // Retornar a função saveData para ser usada externamente
  return saveData;
}


function addSavings() {
  const table = document.getElementById('savingsTable').getElementsByTagName('tbody')[0];

  // Função para salvar os dados
  const saveData = () => {
      const row = table.insertRow();

      for (let i = 0; i < 6; i++) {
          const cell = row.insertCell(i);
          if (i < 5) {
              cell.contentEditable = 'true';
          } else {
              cell.innerHTML = createActionButtons();
          }
      }

      // Obter valores dos campos de input
      const newSaving = {
          name: document.getElementById('savingsName').value || '',
          date: document.getElementById('savingsDate').value || '',
          price: parseFloat(document.getElementById('savingsAmount').value || 0).toFixed(2),
          goal: parseFloat(document.getElementById('savingsGoal').value || 0).toFixed(2)
      };

      // Inserir valores na tabela
      row.cells[0].innerText = newSaving.name;
      row.cells[1].innerText = newSaving.date;
      row.cells[2].innerText = `R$: ${newSaving.price}`;
      row.cells[3].innerText = `R$: ${newSaving.goal}`;
      row.cells[4].innerText = `R$: ${(newSaving.goal - newSaving.price).toFixed(2)}`;

      // Enviar dados para o backend
      fetch('/finance/addSavings', {
          method: 'POST ',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSaving),
      })
      .then(response => response.json())
      .then(data => {
          console.log('Economia adicionada com sucesso:', data);
          updateTotals();
      })
      .catch(error => {
          console.error('Erro ao adicionar economia:', error);
      });

      updateTotals();
  };

  return saveData;
}


// ================================

// Inicialização
setupPopups();
fetchFinance();
updateTotals();
