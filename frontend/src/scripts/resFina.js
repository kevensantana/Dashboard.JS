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
// 2. FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO
// ================================

function initializeApp() {
    fetch('/finance/dados') // Buscar dados de despesas e economias
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar dados');
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados recebidos da API:', data); // Log para depuração
            if (!Array.isArray(data) || data.length === 0) {
                console.error('Nenhum usuário encontrado nos dados recebidos da API');
                return;
            }

            const user = data[0]; // Escolhe o primeiro usuário da lista

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
    const table = row.parentElement;
    const expenseId = row.getAttribute('data-id');
    const expenseType = table.getAttribute('data-type');

    // Remove a linha da tabela
    row.parentElement.removeChild(row);

    // Atualiza os totais
    updateTotals();

    // Envia uma requisição para o backend para remover a despesa
    fetch(`/finance/deleteExpense`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expenseId, expenseType }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Erro ao excluir despesa');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Despesa excluída com sucesso:', data);
    })
    .catch(error => {
        console.error('Erro ao excluir despesa:', error);
    });
}


// ================================
// 7. FUNÇÕES DE POPUP
// ================================

/**
 * 7.1. Abre o popup para adicionar despesa
 */
function openPopup() {
    expensePopup.style.display = 'flex';
    savingsPopup.style.display = 'flex';
}
/**
 * 7.2. Fecha o popup para adicionar despesa
 */
function closePopup() {
    expensePopup.style.display = 'none';
    savingsPopup.style.display = 'none';
}


// ================================
// 8. FUNÇÕES DE ADIÇÃO
// ================================

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
            method: 'POST',
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



/**
 * 8.2. Função para adicionar uma nova economia
 */
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
            method: 'POST',
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

// Adicionar evento ao botão de salvar





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

// const saveExpenseButton = document.getElementById('saveExpenseButton');
// saveExpenseButton?.addEventListener('click', () => {
//     const saveData = addExpense(currentExpenseType);
//     saveData();
//     closePopupFunc();
// });

cancelExpenseButton?.addEventListener('click', closePopupFunc);
closePopup?.addEventListener('click', closePopupFunc);

// =======================

addSavingsButton?.addEventListener('click', openSavingsPopup);

// const saveSavingsButton = document.getElementById('saveSavingsButton');
// saveSavingsButton?.addEventListener('click', () => {
//     const saveData = addSavings();
//     saveData();
//     closeSavingsPopupFunc();
// });

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

































// / ================================
// 1. FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO
// ================================

function initializeApp(loggedInUserId) {
    fetch('/finance/dados')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar dados');
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                console.error('Nenhum usuário encontrado nos dados recebidos da API');
                return;
            }

            const user = data.find(user => user.id === loggedInUserId); // Verifica se o usuário logado está na lista

            if (!user) {
                showError('Usuário não encontrado ou não autorizado');
                return;
            }

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
// ================================
// 2. FUNÇÕES DE RENDERIZAÇÃO
// ================================

/**
 * Renderiza despesas na tabela especificada
 * @param {string} tableId - ID da tabela onde as despesas serão renderizadas
 * @param {Array} expenses - Lista de despesas
 */
function renderExpenses(tableId, expenses) {
    const tableBody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Limpar tabela

    expenses.forEach(expense => {
        const row = tableBody.insertRow();
        row.setAttribute('data-id', expense.id); // Adiciona o atributo data-id com o ID da despesa
        addExpenseCells(row, expense);
        row.insertCell(6).innerHTML = createActionButtons();
    });
}
/**
 * Renderiza economias na tabela de economias
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
    const table = row.parentElement;
    const expenseId = row.getAttribute('data-id');
    const expenseType = table.getAttribute('data-type');

    console.log('Expense Type:', expenseType); // Adicione um log para depuração

    // Verifica se expenseType é válido
    if (expenseType !== 'fixed' && expenseType !== 'variable') {
        console.error('Tipo de despesa inválido:', expenseType);
        return;
    }

    // Remove a linha da tabela
    row.parentElement.removeChild(row);

    // Atualiza os totais
    updateTotals();

    // Envia uma requisição para o backend para remover a despesa
    fetch('/finance/deleteExpense', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expenseId, expenseType }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Erro ao excluir despesa');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Despesa excluída com sucesso:', data);
    })
    .catch(error => {
        console.error('Erro ao excluir despesa:', error);
    });
}


// ================================
// 7. FUNÇÕES DE POPUP
// ================================

/**
 * 7.1. Abre o popup para adicionar despesa
 */
function openPopup() {
    expensePopup.style.display = 'flex';
}

/**
 * 7.2. Fecha o popup para adicionar despesa
 */
function closePopup() {
    expensePopup.style.display = 'none';
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
            method: 'POST',
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



/**
 * 8.2. Função para adicionar uma nova economia
 */
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
            method: 'POST',
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

const saveExpenseButton = document.getElementById('saveExpenseButton');
saveExpenseButton?.addEventListener('click', () => {
    const saveData = addExpense(currentExpenseType);
    saveData();
    closePopupFunc();
});

cancelExpenseButton?.addEventListener('click', closePopupFunc);
closePopup?.addEventListener('click', closePopupFunc);

// =======================

addSavingsButton?.addEventListener('click', openSavingsPopup);

const saveSavingsButton = document.getElementById('saveSavingsButton');
saveSavingsButton?.addEventListener('click', () => {
    const saveData = addSavings();
    saveData();
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

// window.deleteExpense = deleteExpense;
window.editExpense = editExpense;

