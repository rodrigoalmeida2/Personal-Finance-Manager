document.getElementById('cadastro-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Impede o envio padrão do formulário

    // Captura os dados do formulário
    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;

    // Envia os dados para o servidor
    fetch('/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, senha }), // Envia os dados como JSON
    })
    .then(response => response.json()) // Converte a resposta para JSON
    .then(data => {
        if (data.success) {
            // Redireciona o usuário para a página de login em caso de sucesso
            window.location.href = '/login';
        } else {
            // Exibe a mensagem de erro
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = data.message || 'Erro ao cadastrar. Tente novamente.';
            errorMessage.style.display = 'block'; // Mostra a mensagem de erro
            // Limpa os campos de input
            document.getElementById('nome').value = '';
            document.getElementById('senha').value = '';
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Erro ao tentar cadastrar. Tente novamente mais tarde.';
        errorMessage.style.display = 'block'; // Mostra a mensagem de erro
        // Limpa os campos de input
        document.getElementById('nome').value = '';
        document.getElementById('senha').value = '';
    });
});