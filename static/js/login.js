document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Impede o envio padrão do formulário

    // Captura os dados do formulário
    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;

    // Simula uma requisição ao servidor
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, senha }), // Envia os dados como JSON
    })
    .then(response => response.json()) // Converte a resposta para JSON
    .then(data => {
        if (data.success) {
            // Redireciona o usuário para a página principal em caso de sucesso
            window.location.href = '/principal';
        } else {
            // Exibe a mensagem de erro
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = data.message || 'Credenciais inválidas. Tente novamente.';
            errorMessage.style.display = 'block'; // Mostra a mensagem de erro
            // Limpa os campos de input
            document.getElementById('nome').value = '';
            document.getElementById('senha').value = '';
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Erro ao tentar fazer login. Tente novamente mais tarde.';
        errorMessage.style.display = 'block'; // Mostra a mensagem de erro
        // Limpa os campos de input
        document.getElementById('nome').value = '';
        document.getElementById('senha').value = '';
    });
});