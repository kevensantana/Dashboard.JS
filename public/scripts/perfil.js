function initializeProfile() {
    console.log('Script de perfil carregado');  // Verificação de carregamento do script

    const token = localStorage.getItem('token');
    console.log('Token:', token);  // Log do token

    if (!token) {
        alert('Usuário não autenticado. Faça login primeiro.');
        window.location.href = 'login.html';  // Redirecionar para a página de login
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
            document.getElementById('profile-address').textContent = data.address;
            document.getElementById('profile-phone').textContent = data.phone;
            document.getElementById('profile-balance').textContent = data.balance;
        } else {
            alert('Não foi possível carregar os dados do usuário.');
        }
    })
    .catch(error => console.error('Erro ao carregar o perfil do usuário:', error));
}

function setupProfileEditing() {
    const editProfileBtn = document.getElementById('edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            document.getElementById('profile-container').style.display = 'none';
            document.getElementById('edit-profile-form').style.display = 'block';

            // Preencher o formulário com os dados atuais do perfil
            document.getElementById('edit-username').value = document.getElementById('profile-name').textContent;
            document.getElementById('edit-email').value = document.getElementById('profile-email').textContent;
            document.getElementById('edit-address').value = document.getElementById('profile-address').textContent;
            document.getElementById('edit-phone').value = document.getElementById('profile-phone').textContent;
            document.getElementById('edit-balance').value = document.getElementById('profile-balance').textContent;
        });
    }

    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            document.getElementById('profile-container').style.display = 'block';
            document.getElementById('edit-profile-form').style.display = 'none';
        });
    }

    const saveProfileBtn = document.getElementById('save-profile-btn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            const username = document.getElementById('edit-username').value;
            const email = document.getElementById('edit-email').value;
            const address = document.getElementById('edit-address').value;
            const phone = document.getElementById('edit-phone').value;
            const token = localStorage.getItem('token');
    

            console.log('Salvando perfil:', { username, email });  // Log dos dados sendo salvos

            fetch('/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ username, email, address, phone })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Resposta do servidor:', data);  // Log da resposta do servidor

                if (data.success) {
                    document.getElementById('profile-name').textContent = username;
                    document.getElementById('profile-username').textContent = username;
                    document.getElementById('profile-email').textContent = email;
                    document.getElementById('profile-address').textContent = address;
                    document.getElementById('profile-phone').textContent = phone;
    

                    document.getElementById('profile-container').style.display = 'block';
                    document.getElementById('edit-profile-form').style.display = 'none';
                } else {
                    alert('Erro ao atualizar o perfil.');
                }
            })
            .catch(error => console.error('Erro ao atualizar o perfil:', error));
        });
    }
}

// Verificar se o documento já está pronto
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initializeProfile();
    setupProfileEditing();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        initializeProfile();
        setupProfileEditing();
    });
}
