document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-container');
    const registerForm = document.getElementById('register-container');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    // Mostrar o formulário de login inicialmente
    loginForm.classList.add('active');

    // Alternar para o formulário de cadastro
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    });

    // Alternar para o formulário de login
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
    });

    // Manipular a submissão do formulário de login
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Verificar o usuário e autenticar
        fetch('/auth/login' || '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                // Armazenar o token no localStorage
                localStorage.setItem('token', data.token);
                
                // Se "Manter logado" estiver marcado, configurar o cookie
                if (rememberMe) {
                    const expiryTime = new Date();
                    expiryTime.setHours(expiryTime.getHours() + 1);
                    document.cookie = `token=${data.token}; expires=${expiryTime.toUTCString()}; path=/`;
                }

                // Redirecionar para o dashboard
                window.location.href = '../../views';
            } else {
                // Exibir mensagem de erro
                document.getElementById('error-message').textContent = 'Nome de usuário ou senha incorretos';
            }
        })
        .catch(error => console.error('Erro ao autenticar:', error));
    });

    // Manipular a submissão do formulário de cadastro
    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newUsername = document.getElementById('new-username').value;
        const email = document.getElementById('email').value;
        const newPassword = document.getElementById('new-password').value;

        // Enviar dados de cadastro para o servidor
        fetch('/auth/register' || '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: newUsername, email, password: newPassword })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao cadastrar usuário');
            }
            return response.json();
        })
        .then(data => {
            alert('Cadastro realizado com sucesso');
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
        })
        .catch(error => {
            document.getElementById('error-message').textContent = 'Erro ao realizar o cadastro';
            console.error('Erro ao cadastrar usuário:', error);
        });
    });
});