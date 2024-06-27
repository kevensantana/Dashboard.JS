
/**
 * Função para executar testes das funcionalidades e exibir resultados no console
 */
function runTests() {
  console.clear();
  const testResults = [];

  try {
      // Teste de renderização de despesas fixas
      renderExpenses('fixedExpensesTable', [
          // { name: 'Aluguel', date: '2023-01-01', price: 1000, installment: 'Mensal', paymentDate: '2023-01-05', percentage: '100%' }
      ]);
      testResults.push('Renderização de despesas fixas: OK');

      // Teste de renderização de despesas variáveis
      renderExpenses('variableExpensesTable', [
          // { name: 'Supermercado', date: '2023-01-10', price: 300, installment: 'Mensal', paymentDate: '2023-01-15', percentage: '100%' }
      ]);
      testResults.push('Renderização de despesas variáveis: OK');

      // Teste de renderização de economias
      renderSavings([
          // { name: 'Poupança', date: '2023-01-01', price: 5000, goal: 10000 }
      ]);
      testResults.push('Renderização de economias: OK');

      // Teste de adição de despesa fixa
      currentExpenseType = 'fixed';
      addExpense(currentExpenseType);
      const fixedExpensesTable = document.getElementById('fixedExpensesTable').getElementsByTagName('tbody')[0];
      if (fixedExpensesTable.rows.length > 0) {
          testResults.push('Adição de despesa fixa: OK');
      } else {
          testResults.push('Adição de despesa fixa: Falhou');
      }

      // Teste de adição de economia
      addSavings();
      const savingsTable = document.getElementById('savingsTable').getElementsByTagName('tbody')[0];
      if (savingsTable.rows.length > 0) {
          testResults.push('Adição de economia: OK');
      } else {
          testResults.push('Adição de economia: Falhou');
      }

      // Teste de atualização de totais
      updateTotals();
      const fixedTotal = document.getElementById('fixedTotal').innerText;
      if (fixedTotal.includes('R$')) {
          testResults.push('Atualização de totais: OK');
      } else {
          testResults.push('Atualização de totais: Falhou');
      }

      // Teste de exclusão de despesa
      const deleteButton = fixedExpensesTable.rows[0].cells[6].getElementsByTagName('button')[1];
      deleteExpense(deleteButton);
      if (fixedExpensesTable.rows.length === 0) {
          testResults.push('Exclusão de despesa: OK');
      } else {
          testResults.push('Exclusão de despesa: Falhou');
      }
  } catch (error) {
      testResults.push('Erro durante os testes: ' + error.message);
  }

  // Exibindo resultados dos testes no console
  console.group('Resultados dos Testes');
  testResults.forEach(result => console.log(result));
  console.groupEnd();
}


module.exports = {
  runTests
}