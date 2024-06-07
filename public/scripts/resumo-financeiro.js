document.addEventListener('DOMContentLoaded', function () {
  const addFixedExpenseButton = document.getElementById('addFixedExpenseButton');
  const addVariableExpenseButton = document.getElementById('addVariableExpenseButton');
  const saveExpenseButton = document.getElementById('saveExpenseButton');
  const cancelExpenseButton = document.getElementById('cancelExpenseButton');
  const closePopup = document.getElementById('closePopup');
  const popup = document.getElementById('expensePopup');
  const fixedTotal = document.getElementById('fixedTotal');
  const variableTotal = document.getElementById('variableTotal');
  const overallTotal = document.getElementById('overallTotal');

  let currentExpenseType = '';

  // Função para atualizar os totais e porcentagens
  function updateTotals() {
      let fixedSum = 0;
      let variableSum = 0;

      document.querySelectorAll('#fixedExpensesTable tbody tr').forEach(row => {
          fixedSum += parseFloat(row.cells[2].innerText);
      });

      document.querySelectorAll('#variableExpensesTable tbody tr').forEach(row => {
          variableSum += parseFloat(row.cells[2].innerText);
      });

      const overallSum = fixedSum + variableSum;
      const fixedPercent = (fixedSum / overallSum) * 100 || 0;
      const variablePercent = (variableSum / overallSum) * 100 || 0;

      fixedTotal.innerText = fixedSum.toFixed(2);
      variableTotal.innerText = variableSum.toFixed(2);
      overallTotal.innerText = overallSum.toFixed(2);

      document.querySelectorAll('#fixedExpensesTable .percentage').forEach(td => {
          td.innerText = fixedPercent.toFixed(2) + '%';
      });

      document.querySelectorAll('#variableExpensesTable .percentage').forEach(td => {
          td.innerText = variablePercent.toFixed(2) + '%';
      });
  }

  // Função para adicionar nova despesa
  function addExpense(expenseType) {
      const table = expenseType === 'fixed' ? document.getElementById('fixedExpensesTable').getElementsByTagName('tbody')[0] : document.getElementById('variableExpensesTable').getElementsByTagName('tbody')[0];
      const row = table.insertRow();

      for (let i = 0; i < 7; i++) {
          const cell = row.insertCell(i);
          if (i < 6) {
              cell.contentEditable = 'true';
          } else {
              cell.innerHTML = `<button onclick="editExpense(this)"><i class="fas fa-edit"></i></button>
                                <button onclick="deleteExpense(this)"><i class="fas fa-trash-alt"></i></button>`;
          }
      }

      row.classList.add(expenseType);

      row.cells[0].innerText = document.getElementById('expenseName').value;
      row.cells[1].innerText = document.getElementById('expenseDate').value;
      row.cells[2].innerText = parseFloat(document.getElementById('expensePrice').value).toFixed(2);
      row.cells[3].innerText = document.getElementById('expenseInstallment').value;
      row.cells[4].innerText = document.getElementById('paymentDate').value;
      row.cells[5].innerText = '0%'; // Porcentagem será atualizada posteriormente

      updateTotals();
  }

  // Função para excluir despesa
  function deleteExpense(button) {
      const row = button.parentElement.parentElement;
      row.parentElement.removeChild(row);
      updateTotals();
  }

  // Função para abrir popup
  function openPopup() {
      popup.style.display = 'flex';
  }

  // Função para fechar popup
  function closePopupFunc() {
      popup.style.display = 'none';
  }

  // Função para editar despesa (opcional)
  window.editExpense = function (button) {
      const row = button.parentElement.parentElement;
      row.contentEditable = true;
  };

  window.deleteExpense = deleteExpense;

  // Event listeners
  addFixedExpenseButton.addEventListener('click', () => {
      currentExpenseType = 'fixed';
      openPopup();
  });
  addVariableExpenseButton.addEventListener('click', () => {
      currentExpenseType = 'variable';
      openPopup();
  });
  saveExpenseButton.addEventListener('click', () => {
      addExpense(currentExpenseType);
      closePopupFunc();
  });
  cancelExpenseButton.addEventListener('click', closePopupFunc);
  closePopup.addEventListener('click', closePopupFunc);

  // Atualizar os totais inicialmente
  updateTotals();
});
