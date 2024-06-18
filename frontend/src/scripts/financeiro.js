// Função principal que inicializa a aplicação
function initializeApp() {
  // Obtém referências aos elementos HTML que serão manipulados
  const addFixedExpenseButton = document.getElementById('addFixedExpenseButton'); // Botão para adicionar despesa fixa
  const addVariableExpenseButton = document.getElementById('addVariableExpenseButton'); // Botão para adicionar despesa variável
  const saveExpenseButton = document.getElementById('saveExpenseButton'); // Botão para salvar a despesa
  const cancelExpenseButton = document.getElementById('cancelExpenseButton'); // Botão para cancelar a adição de despesa
  const closePopup = document.getElementById('closePopup'); // Botão para fechar o popup
  const popup = document.getElementById('expensePopup'); // Elemento popup para adicionar despesas
  const fixedTotal = document.getElementById('fixedTotal'); // Elemento para mostrar o total de despesas fixas
  const variableTotal = document.getElementById('variableTotal'); // Elemento para mostrar o total de despesas variáveis
  const overallTotal = document.getElementById('overallTotal'); // Elemento para mostrar o total geral de despesas

  const addSavingsButton = document.getElementById('addSavingsButton'); // Botão para adicionar economia
  const saveSavingsButton = document.getElementById('saveSavingsButton'); // Botão para salvar economia
  const cancelSavingsButton = document.getElementById('cancelSavingsButton'); // Botão para cancelar a adição de economia
  const closeSavingsPopup = document.getElementById('closeSavingsPopup'); // Botão para fechar o popup de economia
  const savingsPopup = document.getElementById('savingsPopup'); // Elemento popup para adicionar economias

  let currentExpenseType = ''; // Tipo de despesa atual (fixa ou variável)

  /**
   * Função para atualizar os totais e porcentagens das despesas
   */
  function updateTotals() {
      console.log('Atualizando totais...');
      let fixedSum = 0; // Soma das despesas fixas
      let variableSum = 0; // Soma das despesas variáveis

      // Calcula a soma das despesas fixas
      document.querySelectorAll('#fixedExpensesTable tbody tr').forEach(row => {
          fixedSum += parseFloat(row.cells[2].innerText) || 0;
      });

      // Calcula a soma das despesas variáveis
      document.querySelectorAll('#variableExpensesTable tbody tr').forEach(row => {
          variableSum += parseFloat(row.cells[2].innerText) || 0;
      });

      const overallSum = fixedSum + variableSum; // Soma total das despesas
      const fixedPercent = (fixedSum / overallSum) * 100 || 0; // Porcentagem de despesas fixas
      const variablePercent = (variableSum / overallSum) * 100 || 0; // Porcentagem de despesas variáveis

      // Atualiza os valores dos totais no HTML
      fixedTotal.innerText = fixedSum.toFixed(2);
      variableTotal.innerText = variableSum.toFixed(2);
      overallTotal.innerText = overallSum.toFixed(2);

      // Atualiza as porcentagens de despesas fixas no HTML
      document.querySelectorAll('#fixedExpensesTable .percentage').forEach(td => {
          td.innerText = fixedPercent.toFixed(2) + '%';
      });

      // Atualiza as porcentagens de despesas variáveis no HTML
      document.querySelectorAll('#variableExpensesTable .percentage').forEach(td => {
          td.innerText = variablePercent.toFixed(2) + '%';
      });

      console.log('Totais atualizados:', { fixedSum, variableSum, overallSum });
  }

  /**
   * Função para adicionar uma nova despesa
   * @param {string} expenseType - Tipo de despesa ('fixed' ou 'variable')
   */
  function addExpense(expenseType) {
      console.log('Adicionando despesa do tipo:', expenseType);
      const table = expenseType === 'fixed'
          ? document.getElementById('fixedExpensesTable').getElementsByTagName('tbody')[0]
          : document.getElementById('variableExpensesTable').getElementsByTagName('tbody')[0]; // Seleciona a tabela correta

      const row = table.insertRow(); // Insere uma nova linha na tabela

      // Adiciona células à nova linha e define se são editáveis
      for (let i = 0; i < 7; i++) {
          const cell = row.insertCell(i);
          if (i < 6) {
              cell.contentEditable = 'true';
          } else {
              cell.innerHTML = `<button onclick="editExpense(this)"><i class="fas fa-edit"></i></button>
                                <button onclick="deleteExpense(this)"><i class="fas fa-trash-alt"></i></button>`;
          }
      }

      row.classList.add(expenseType); // Adiciona uma classe à linha de despesa

      // Preenche as células com os valores dos inputs do popup
      row.cells[0].innerText = document.getElementById('expenseName').value || '';
      row.cells[1].innerText = document.getElementById('expenseDate').value || '';
      row.cells[2].innerText = parseFloat(document.getElementById('expensePrice').value || 0).toFixed(2);
      row.cells[3].innerText = document.getElementById('expenseInstallment').value || '';
      row.cells[4].innerText = document.getElementById('paymentDate').value || '';
      row.cells[5].innerText = '0%'; // A porcentagem será atualizada posteriormente

      updateTotals(); // Atualiza os totais e porcentagens
      console.log('Despesa adicionada:', row);
  }

  /**
   * Função para adicionar uma nova economia
   */
  function addSavings() {
      console.log('Adicionando economia...');
      const table = document.getElementById('savingsTable').getElementsByTagName('tbody')[0]; // Seleciona a tabela de economias

      const row = table.insertRow(); // Insere uma nova linha na tabela

      // Adiciona células à nova linha e define se são editáveis
      for (let i = 0; i < 6; i++) {
          const cell = row.insertCell(i);
          if (i < 5) {
              cell.contentEditable = 'true';
          } else {
              cell.innerHTML = `<button onclick="editExpense(this)"><i class="fas fa-edit"></i></button>
                                <button onclick="deleteExpense(this)"><i class="fas fa-trash-alt"></i></button>`;
          }
      }

      // Preenche as células com os valores dos inputs do popup
      row.cells[0].innerText = document.getElementById('savingsName').value || '';
      row.cells[1].innerText = document.getElementById('savingsDate').value || '';
      row.cells[2].innerText = parseFloat(document.getElementById('savingsAmount').value || 0).toFixed(2);
      row.cells[3].innerText = parseFloat(document.getElementById('savingsGoal').value || 0).toFixed(2);
      row.cells[4].innerText = '0%'; // A porcentagem será atualizada posteriormente

      console.log('Economia adicionada:', row);
  }

  /**
   * Função para excluir uma despesa ou economia
   * @param {HTMLElement} button - Botão que foi clicado para excluir a despesa ou economia
   */
  function deleteExpense(button) {
      console.log('Excluindo despesa/economia...');
      const row = button.parentElement.parentElement; // Seleciona a linha da despesa ou economia
      row.parentElement.removeChild(row); // Remove a linha da tabela
      updateTotals(); // Atualiza os totais e porcentagens
      console.log('Despesa/economia excluída.');
  }

  /**
   * Função para editar uma despesa ou economia
   * @param {HTMLElement} button - Botão que foi clicado para editar a despesa ou economia
   */
  function editExpense(button) {
      console.log('Editando despesa/economia...');
      const row = button.parentElement.parentElement;
      const isEditing = button.classList.contains('editing');

      if (isEditing) {
          // Salva as alterações e muda o ícone para 'editar'
          button.innerHTML = '<i class="fas fa-edit"></i>';
          button.classList.remove('editing');
      } else {
          // Permite a edição e muda o ícone para 'salvar'
          button.innerHTML = '<i class="fas fa-save"></i>';
          button.classList.add('editing');
      }

      for (let i = 0; i < row.cells.length - 1; i++) {
          row.cells[i].contentEditable = isEditing ? 'false' : 'true';
      }

      if (isEditing) {
          updateTotals(); // Atualiza os totais ao salvar
      }

      console.log('Despesa/economia editável:', row, 'Status de edição:', !isEditing);
  }

  /**
   * Função para abrir o popup de adicionar despesa
   */
  function openPopup() {
      console.log('Abrindo popup de despesa...');
      popup.style.display = 'flex';
  }

  /**
   * Função para fechar o popup de adicionar despesa
   */
  function closePopupFunc() {
      console.log('Fechando popup de despesa...');
      popup.style.display = 'none';
  }

  /**
   * Função para abrir o popup de adicionar economia
   */
  function openSavingsPopup() {
      console.log('Abrindo popup de economia...');
      savingsPopup.style.display = 'flex';
  }

  /**
   * Função para fechar o popup de adicionar economia
   */
  function closeSavingsPopupFunc() {
      console.log('Fechando popup de economia...');
      savingsPopup.style.display = 'none';
  }

  // Adiciona as funções ao escopo global para serem acessíveis pelos botões
  window.deleteExpense = deleteExpense;
  window.editExpense = editExpense;

  // Adiciona event listeners aos botões
  addFixedExpenseButton?.addEventListener('click', () => {
      currentExpenseType = 'fixed';
      openPopup();
  });

  addVariableExpenseButton?.addEventListener('click', () => {
      currentExpenseType = 'variable';
      openPopup();
  });

  saveExpenseButton?.addEventListener('click', () => {
      addExpense(currentExpenseType);
      closePopupFunc();
  });

  cancelExpenseButton?.addEventListener('click', closePopupFunc);
  closePopup?.addEventListener('click', closePopupFunc);

  addSavingsButton?.addEventListener('click', openSavingsPopup);
  saveSavingsButton?.addEventListener('click', () => {
      addSavings();
      closeSavingsPopupFunc();
  });

  cancelSavingsButton?.addEventListener('click', closeSavingsPopupFunc);
  closeSavingsPopup?.addEventListener('click', closeSavingsPopupFunc);

  // Atualiza os totais ao iniciar a aplicação
  updateTotals();
}

// Carrega a aplicação após o carregamento completo da página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
