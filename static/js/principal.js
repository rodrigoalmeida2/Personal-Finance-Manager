// Mostrar/Ocultar o Formulário de Adicionar Transação
document.getElementById('mostrar-formulario').addEventListener('click', function () {
    const formulario = document.getElementById('transacao-form');
    if (formulario.style.display === 'none') {
        formulario.style.display = 'block'; // Mostra o formulário
    } else {
        formulario.style.display = 'none'; // Oculta o formulário
    }
});

// Função para abrir popups
function abrirPopup(popupId) {
    const popup = document.getElementById(popupId);
    const overlay = document.getElementById('overlay');
    popup.style.display = 'block';
    overlay.style.display = 'block';
}

// Função para fechar popups
function fecharPopup(popupId) {
    const popup = document.getElementById(popupId);
    const overlay = document.getElementById('overlay');
    popup.style.display = 'none';
    overlay.style.display = 'none';
}

// Consultar Saldo (Abre o popup)
document.getElementById('consultar-saldo').addEventListener('click', function (e) {
    e.preventDefault(); // Impede o comportamento padrão do link

    fetch('/consultar_saldo')
    .then(response => response.json())
    .then(data => {
        document.getElementById('popup-saldo-valor').textContent = data.saldo.toFixed(2); // Atualiza o valor do saldo no popup
        abrirPopup('saldo-popup'); // Abre o popup de saldo
    })
    .catch(error => {
        console.error('Erro ao consultar saldo:', error);
    });
});

// Fechar o popup de saldo
document.getElementById('fechar-saldo-popup').addEventListener('click', function () {
    fecharPopup('saldo-popup');
});

// Listar Transações (Abre o popup)
document.getElementById('listar-transacoes').addEventListener('click', function (e) {
    e.preventDefault(); // Impede o comportamento padrão do link

    fetch('/listar_transacoes')
    .then(response => response.json())
    .then(data => {
        const transacoesList = document.getElementById('popup-transacoes-list');
        transacoesList.innerHTML = ''; // Limpa a lista anterior
        data.transacoes.forEach(transacao => {
            const li = document.createElement('li');
            li.textContent = `${transacao.descricao} - R$ ${transacao.valor.toFixed(2)} (${transacao.tipo})`;
            transacoesList.appendChild(li);
        });
        abrirPopup('transacoes-popup'); // Abre o popup de transações
    })
    .catch(error => {
        console.error('Erro ao listar transações:', error);
    });
});

// Fechar o popup de transações
document.getElementById('fechar-transacoes-popup').addEventListener('click', function () {
    fecharPopup('transacoes-popup');
});

const form = document.querySelector('form');
form.addEventListener('submit', function (e) {
    e.preventDefault();
    fetch('/adicionar_transacao', {
        method: 'POST',
        body: new FormData(form)
    })
    .then(response => response.json())
    .then(data => {
        if (data.transacao) {
            const transacaoList = document.querySelector('ul');
            const newTransacao = document.createElement('li');
            newTransacao.textContent = `${data.transacao.descricao} - R$ ${data.transacao.valor} (${data.transacao.tipo})`;
            transacaoList.appendChild(newTransacao);
        }
    });
});

document.querySelector('#logout').addEventListener('click', function (e) {
    e.preventDefault();
    fetch('/logout', { method: 'POST' })
    .then(() => {
        window.location.href = '/login';
    });
});