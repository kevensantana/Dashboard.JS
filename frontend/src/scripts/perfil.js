// Função para buscar o perfil do usuário
const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/'; // Redirecionar para a página de login se o token não estiver presente
        return;
    }

    try {
        const response = await fetch('/auth/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            // Atualizar a exibição do perfil
            document.getElementById('profile-username').textContent = data.user.username;
            document.getElementById('profile-email').textContent = data.user.email;
            document.getElementById('profile-age').textContent = data.user.age || 'Não fornecido';
            document.getElementById('profile-address').textContent = data.user.address || 'Não fornecido';
            document.getElementById('profile-phone').textContent = data.user.phone || 'Não fornecido';
            document.getElementById('profile-balance').textContent = data.user.balance || '0';
        } else {
            console.error('Erro ao obter informações do usuário:', data.message);
            window.location.href = '/'; // Redirecionar para a página de login em caso de erro
        }
    } catch (error) {
        console.error('Erro ao obter informações do usuário:', error);
        window.location.href = '/'; // Redirecionar para a página de login em caso de erro
    }
};

// Função para atualizar o perfil do usuário
const updateUserProfile = async (username, email, address, phone, balance) => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/'; // Redirecionar para a página de login se o token não estiver presente
        return;
    }

    try {
        const response = await fetch('/auth/update-profile', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, address, phone, balance })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Perfil atualizado com sucesso!');
            // Atualizar a exibição do perfil
            document.getElementById('profile-username').textContent = data.user.username;
            document.getElementById('profile-email').textContent = data.user.email;
            document.getElementById('profile-age').textContent = data.user.age || 'Não fornecido';
            document.getElementById('profile-address').textContent = data.user.address || 'Não fornecido';
            document.getElementById('profile-phone').textContent = data.user.phone || 'Não fornecido';
            document.getElementById('profile-balance').textContent = data.user.balance || '0';
        } else {
            console.error('Erro ao atualizar o perfil:', data.message);
        }
    } catch (error) {
        console.error('Erro ao atualizar o perfil:', error);
    }
};

// Configura os eventos para os botões de edição e salvamento do perfil
const setupEventListeners = () => {
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const profileContainer = document.getElementById('profile-container');
    const editProfileForm = document.getElementById('edit-profile-form');

    // Mostrar formulário de edição
    editProfileBtn.addEventListener('click', () => {
        profileContainer.style.display = 'none';
        editProfileForm.style.display = 'block';

        // Preencher o formulário com os valores atuais do perfil
        document.getElementById('edit-username').value = document.getElementById('profile-username').textContent;
        document.getElementById('edit-email').value = document.getElementById('profile-email').textContent;
        document.getElementById('edit-age').value = document.getElementById('profile-age').textContent;
        document.getElementById('edit-address').value = document.getElementById('profile-address').textContent;
        document.getElementById('edit-phone').value = document.getElementById('profile-phone').textContent;
        document.getElementById('edit-balance').value = document.getElementById('profile-balance').textContent;
    });

    // Salvar alterações
    saveProfileBtn.addEventListener('click', () => {
        const username = document.getElementById('edit-username').value;
        const email = document.getElementById('edit-email').value;
        const age = document.getElementById('edit-age').value;
        const address = document.getElementById('edit-address').value;
        const phone = document.getElementById('edit-phone').value;
        const balance = document.getElementById('edit-balance').value;

        updateUserProfile(username, email, age, address, phone, balance);

        profileContainer.style.display = 'block';
        editProfileForm.style.display = 'none';
    });

    // Cancelar edição
    cancelEditBtn.addEventListener('click', () => {
        profileContainer.style.display = 'block';
        editProfileForm.style.display = 'none';
    });
}

// Inicializa a aplicação
fetchUserProfile();
setupEventListeners();
