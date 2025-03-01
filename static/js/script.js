// Função para exibir mensagens de erro/sucesso
function exibirMensagem(elemento, mensagem, sucesso = true) {
    elemento.textContent = mensagem;
    elemento.style.color = sucesso ? "green" : "red";
}

// Validação do formulário de login
document.getElementById('form-login')?.addEventListener('submit', function(event) {
    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;
    const mensagemErro = document.getElementById('mensagem-erro');

    if (!nome || !senha) {
        event.preventDefault();
        exibirMensagem(mensagemErro, "Preencha todos os campos.", false);
    }
});

// Validação do formulário de cadastro
document.getElementById('form-cadastro')?.addEventListener('submit', function(event) {
    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;
    const mensagemErro = document.getElementById('mensagem-erro');

    if (!nome || !senha) {
        event.preventDefault();
        exibirMensagem(mensagemErro, "Preencha todos os campos.", false);
    }
});

// Adicionar transação via AJAX
document.getElementById('form-adicionar-transacao')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const descricao = document.getElementById('descricao').value;
    const valor = document.getElementById('valor').value;
    const tipo = document.getElementById('tipo').value;
    const mensagemTransacao = document.getElementById('mensagem-transacao');

    fetch('/adicionar_transacao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `descricao=${encodeURIComponent(descricao)}&valor=${valor}&tipo=${tipo}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.erro) {
            exibirMensagem(mensagemTransacao, data.erro, false);
        } else {
            exibirMensagem(mensagemTransacao, "Transação adicionada com sucesso!");
            document.getElementById('descricao').value = '';
            document.getElementById('valor').value = '';
            document.getElementById('tipo').value = 'receita';
            listarTransacoes(); // Atualiza a lista de transações
        }
    });
});

// Consultar saldo via AJAX
document.getElementById('botao-consultar-saldo')?.addEventListener('click', function() {
    const mensagemSaldo = document.getElementById('mensagem-saldo');

    fetch('/consultar_saldo')
    .then(response => response.json())
    .then(data => {
        if (data.erro) {
            exibirMensagem(mensagemSaldo, data.erro, false);
        } else {
            exibirMensagem(mensagemSaldo, `Saldo atual: R$ ${data.saldo}`);
        }
    });
});

// Listar transações via AJAX
function listarTransacoes() {
    const listaTransacoes = document.getElementById('lista-transacoes');

    fetch('/listar_transacoes')
    .then(response => response.json())
    .then(data => {
        listaTransacoes.innerHTML = '';
        data.forEach(transacao => {
            const li = document.createElement('li');
            li.textContent = `${transacao.descricao} - R$ ${transacao.valor} (${transacao.tipo})`;
            listaTransacoes.appendChild(li);
        });
    });
}

// Carregar transações ao entrar na página principal
if (window.location.pathname === '/principal') {
    listarTransacoes();
}