// Função para manipular a submissão do formulário de login
const handleLogin = async (event) => {
    event.preventDefault();
   
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Armazenar o token no localStorage
            localStorage.setItem('token', data.token);
            
            // Se Manter logado estiver marcado, configurar o cookie
            if (rememberMe) {
                const expiryTime = new Date();
                expiryTime.setHours(expiryTime.getHours() + 1);
                document.cookie = `token=${data.token}; expires=${expiryTime.toUTCString()}; path=/`;
            }

            // Redirecionar para o dashboard
            window.location.href = '../../views';
        } else {
            // Exibir mensagem de erro
            document.getElementById('error-message').textContent = data.message || 'Nome de usuário ou senha incorretos';
        }
    } catch (error) {
        console.error('Erro ao autenticar:', error);
        document.getElementById('error-message').textContent = 'Erro ao autenticar';
    }
};

// Função para manipular a submissão do formulário de cadastro
const handleRegister = async (event) => {
    event.preventDefault();

    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;
    const newEmail = document.getElementById('new-email').value;
    const age = document.getElementById('age').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: newUsername, password: newPassword, email: newEmail, age, phone, address })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Cadastro realizado com sucesso');
            // Alternar para o formulário de login
            document.getElementById('register-container').classList.remove('active');
            document.getElementById('login-container').classList.add('active');
        } else {
            // Exibir mensagem de erro
            console.log(data.message);
            alert('Usuário ou email já cadastrado');    
            document.getElementById('error-message').textContent = data.message || 'Usuário ou email já cadastrado';
        }
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        document.getElementById('error-message').textContent = 'Usuário ou email já cadastrado';
    }
};


// Função para alternar para o formulário de registro
const showRegisterForm = (event) => {
    event.preventDefault();
    document.getElementById('login-container').classList.remove('active');
    document.getElementById('register-container').classList.add('active');
};

// Função para alternar para o formulário de login
const showLoginForm = (event) => {
    event.preventDefault();
    document.getElementById('register-container').classList.remove('active');
    document.getElementById('login-container').classList.add('active');
};

// Configura os eventos para os formulários e links
const setupEventListeners = () => {
    // Mostrar o formulário de login inicialmente
    document.getElementById('login-container').classList.add('active');
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('show-register').addEventListener('click', showRegisterForm);
    document.getElementById('show-login').addEventListener('click', showLoginForm);
};

// Inicializa a aplicação
setupEventListeners();
