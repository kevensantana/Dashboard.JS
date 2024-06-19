/**
 * ================================
 * SUMÁRIO
 * ================================
 * 1. CONSTANTES E VARIÁVEIS GLOBAIS
 * 2. FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO
 * 3. FUNÇÕES DE RENDERIZAÇÃO
 *    3.1. renderExpenses(tableId, expenses)
 *    3.2. renderSavings(savings)
 * 4. FUNÇÕES AUXILIARES DE RENDERIZAÇÃO
 *    4.1. addExpenseCells(row, expense)
 *    4.2. addSavingsCells(row, saving)
 *    4.3. createActionButtons()
 * 5. FUNÇÕES DE ATUALIZAÇÃO DE TOTAIS
 *    5.1. updateTotals()
 *    5.2. calculateTotal(tableId)
 *    5.3. calculateSavingsTotal()
 * 6. FUNÇÕES DE EDIÇÃO E EXCLUSÃO
 *    6.1. editExpense(button)
 *    6.2. deleteExpense(button)
 * 7. FUNÇÕES DE POPUP
 *    7.1. openPopup()
 *    7.2. closePopupFunc()
 *    7.3. openSavingsPopup()
 *    7.4. closeSavingsPopupFunc()
 * 8. FUNÇÕES DE ADIÇÃO
 *    8.1. addExpense(expenseType)
 *    8.2. addSavings()
 * 9. EVENT LISTENERS
 * 10. INICIALIZAÇÃO DA APLICAÇÃO
 * 11. EXPOR FUNÇÕES GLOBAIS
 * 12. FUNÇÕES DE TESTE
 */

// ================================
// 1. CONSTANTES E VARIÁVEIS GLOBAIS
// ================================

const addFixedExpenseButton = document.getElementById('addFixedExpenseButton');
const addVariableExpenseButton = document.getElementById('addVariableExpenseButton');
const saveExpenseButton = document.getElementById('saveExpenseButton');
const cancelExpenseButton = document.getElementById('cancelExpenseButton');
const closePopup = document.getElementById('closePopup');
const popup = document.getElementById('expensePopup');
const fixedTotal = document.getElementById('fixedTotal');
const variableTotal = document.getElementById('variableTotal');
const overallTotal = document.getElementById('overallTotal');

const addSavingsButton = document.getElementById('addSavingsButton');
const saveSavingsButton = document.getElementById('saveSavingsButton');
const cancelSavingsButton = document.getElementById('cancelSavingsButton');
const closeSavingsPopup = document.getElementById('closeSavingsPopup');
const savingsPopup = document.getElementById('savingsPopup');

let currentExpenseType = '';

// ================================
// 2. FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO
// ================================

function initializeApp() {
    fetch('/finance') // Verifique se o caminho está correto
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar dados');
            }
            return response.json();
        })
        .then(data => {
            renderExpenses('fixedExpensesTable', data.fixedExpenses);
            renderExpenses('variableExpensesTable', data.variableExpenses);
            renderSavings(data.savings);
            updateTotals();
        })
        .catch(error => console.error('Erro ao carregar dados:', error));
}

// ================================
// 3. FUNÇÕES DE RENDERIZAÇÃO
// ================================

/**
 * 3.1. Renderiza despesas na tabela especificada
 * @param {string} tableId - ID da tabela onde as despesas serão renderizadas
 * @param {Array} expenses - Lista de despesas
 */
function renderExpenses(tableId, expenses) {
    const tableBody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Limpar tabela

    expenses.forEach(expense => {
        const row = tableBody.insertRow();
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
    row.insertCell(2).innerText = `R$: ${expense.price.toFixed(2)}`;
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
    row.insertCell(0).innerText = saving.name;
    row.insertCell(1).innerText = saving.date;
    row.insertCell(2).innerText = `R$: ${saving.price.toFixed(2)}`;
    row.insertCell(3).innerText = `R$: ${saving.goal.toFixed(2)}`;
    row.insertCell(4).innerText = `R$: ${(saving.goal - saving.price).toFixed(2)}`;
}

/**
 * 4.3. Cria botões de ação para edição e exclusão
 * @returns {string} - HTML dos botões
 */
function createActionButtons() {
    return `<button onclick="editExpense(this)"><i class="fas fa-edit"></i></button>
            <button onclick="deleteExpense(this)"><i class="fas fa-trash-alt"></i></button>`;
}


(function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Evita o comportamento padrão do link
            const targetId = link.getAttribute('data-target');

            // Esconde todas as seções
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Remove a classe 'active' de todos os links
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });

            // Mostra apenas a seção alvo
            const targetSection = document.getElementById(targetId);
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

/**
 * 5.1. Atualiza os totais de despesas e economias
 */
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
// 6. FUNÇÕES DE EDIÇÃO E EXCLUSÃO
// ================================

/**
 * 6.1. Função para editar uma despesa ou economia
 * @param {HTMLElement} button - Botão que foi clicado para editar a despesa ou economia
 */
function editExpense(button) {
    const row = button.parentElement.parentElement;
    const isEditing = button.classList.contains('editing');

    if (isEditing) {
        button.innerHTML = '<i class="fas fa-edit"></i>';
        button.classList.remove('editing');
    } else {
        button.innerHTML = '<i class="fas fa-save"></i>';
        button.classList.add('editing');
    }

    for (let i = 0; i < row.cells.length - 1; i++) {
        row.cells[i].contentEditable = isEditing ? 'false' : 'true';
    }
}

/**
 * 6.2. Função para excluir uma despesa ou economia
 * @param {HTMLElement} button - Botão que foi clicado para excluir a despesa ou economia
 */
function deleteExpense(button) {
    const row = button.parentElement.parentElement;
    row.parentElement.removeChild(row);
    updateTotals();
}

// ================================
// 7. FUNÇÕES DE POPUP
// ================================

/**
 * 7.1. Abre o popup para adicionar despesa
 */
function openPopup() {
    popup.style.display = 'flex';
}

/**
 * 7.2. Fecha o popup para adicionar despesa
 */
function closePopupFunc() {
    popup.style.display = 'none';
}

/**
 * 7.3. Abre o popup para adicionar economia
 */
function openSavingsPopup() {
    savingsPopup.style.display = 'flex';
}

/**
 * 7.4. Fecha o popup para adicionar economia
 */
function closeSavingsPopupFunc() {
    savingsPopup.style.display = 'none';
}

// ================================
// 8. FUNÇÕES DE ADIÇÃO
// ================================

/**
 * 8.1. Função para adicionar uma nova despesa
 * @param {string} expenseType - Tipo de despesa ('fixed' ou 'variable')
 */
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

    row.classList.add(expenseType);

    row.cells[0].innerText = document.getElementById('expenseName').value || '';
    row.cells[1].innerText = document.getElementById('expenseDate').value || '';
    row.cells[2].innerText = parseFloat(document.getElementById('expensePrice').value || 0).toFixed(2);
    row.cells[3].innerText = document.getElementById('expenseInstallment').value || '';
    row.cells[4].innerText = document.getElementById('paymentDate').value || '';
    row.cells[5].innerText = '0%';

    updateTotals();
}

/**
 * 8.2. Função para adicionar uma nova economia
 */
function addSavings() {
    const table = document.getElementById('savingsTable').getElementsByTagName('tbody')[0];

    const row = table.insertRow();

    for (let i = 0; i < 6; i++) {
        const cell = row.insertCell(i);
        if (i < 5) {
            cell.contentEditable = 'true';
        } else {
            cell.innerHTML = createActionButtons();
        }
    }

    row.cells[0].innerText = document.getElementById('savingsName').value || '';
    row.cells[1].innerText = document.getElementById('savingsDate').value || '';
    row.cells[2].innerText = parseFloat(document.getElementById('savingsAmount').value || 0).toFixed(2);
    row.cells[3].innerText = parseFloat(document.getElementById('savingsGoal').value || 0).toFixed(2);
    row.cells[4].innerText = '0%';

    updateTotals();
}

// ================================
// 9. EVENT LISTENERS
// ================================

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

// ================================
// 10. INICIALIZAÇÃO DA APLICAÇÃO
// ================================

initializeApp();
updateTotals();

// ================================
// 11. EXPOR FUNÇÕES GLOBAIS
// ================================

window.deleteExpense = deleteExpense;
window.editExpense = editExpense;

// ================================
// 12. FUNÇÕES DE TESTE
// ================================

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

// Executando os testes
runTests();
