function initializeProfile() {
    console.log('Script de perfil carregado');  // Verificação de carregamento do script

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Usuário não autenticado. Faça login primeiro.');
        return;
    }

    fetch('/profile', {
        headers: {
            'Authorization': token
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Dados recebidos:', data);  // Log dos dados recebidos

        if (data.username) {
            document.getElementById('profile-name').textContent = data.username;
            document.getElementById('profile-username').textContent = data.username;
            document.getElementById('profile-email').textContent = data.email;
        } else {
            alert('Não foi possível carregar os dados do usuário.');
        }
    })
    .catch(error => console.error('Erro ao carregar o perfil do usuário:', error));
}

// Chamar a função diretamente se o script não for carregado dinamicamente
if (document.readyState === 'complete') {
    initializeProfile();
} else {
    document.addEventListener('DOMContentLoaded', initializeProfile);
}
