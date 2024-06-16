function fetchUserProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/'; // Redirecionar para a página de login se o token não estiver presente
        return;
    }

    fetch('/auth/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('profile-username').textContent = data.user.username;
            document.getElementById('profile-email').textContent = data.user.email;
            document.getElementById('profile-address').textContent = data.user.address || 'Não fornecido';
            document.getElementById('profile-phone').textContent = data.user.phone || 'Não fornecido';
            document.getElementById('profile-balance').textContent = data.user.balance || '0';
        } else {
            console.error('Erro ao obter informações do usuário:', data.message);
            window.location.href = '/'; // Redirecionar para a página de login em caso de erro
        }
    })
    .catch(error => {
        console.error('Erro ao obter informações do usuário:', error);
        window.location.href = '/'; // Redirecionar para a página de login em caso de erro
    });
}

fetchUserProfile();