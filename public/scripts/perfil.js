function initializeProfile() {
    console.log('Perfil script loaded');  // Log to check if the script is loaded
  
    fetch('/user', {
        headers: {
            'Authorization': 'fake-jwt-token'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Received data:', data);  // Log the received data
  
        if (data.success) {
            document.getElementById('profile-name').textContent = data.user.name;
            document.getElementById('profile-username').textContent = data.user.username;
            document.getElementById('profile-email').textContent = data.user.email;
        } else {
            alert('Não foi possível carregar os dados do usuário.');
        }
    })
    .catch(error => console.error('Erro ao carregar o perfil do usuário:', error));
  }
  
  // Call the function directly if the script is not loaded dynamically
  if (document.readyState === 'complete') {
    initializeProfile();
  } else {
    document.addEventListener('DOMContentLoaded', initializeProfile);
  }
  