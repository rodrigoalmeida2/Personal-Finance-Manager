from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from gerenciador import GerenciadorFinancas
from models import Base
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os
app = Flask(__name__)

load_dotenv()

app.secret_key = os.getenv("SECRET_KEY") 

# Configuração do banco de dados
engine = create_engine(os.getenv("DATABASE_URL"), echo=True)
Base.metadata.create_all(engine)
gerenciador = GerenciadorFinancas(engine)

# Rota principal (redireciona para login)
@app.route('/')
def index():
    return redirect(url_for('login'))

# Rota de login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Verifica se os dados foram enviados como JSON (para requisições AJAX)
        if request.is_json:
            data = request.get_json()
            nome = data.get('nome')
            senha = data.get('senha')
        
        usuario = gerenciador.buscar_usuario(nome)
        
        if usuario and usuario.senha == senha:
            session['usuario_id'] = usuario.id
            session['usuario_nome'] = usuario.nome
            
            # Retorna uma resposta JSON para requisições AJAX
            if request.is_json:
                return jsonify({"success": True, "redirect": url_for('principal')})
            else:
                # Redireciona para a página principal em requisições tradicionais
                return redirect(url_for('principal'))
        else:
            # Retorna uma resposta JSON para requisições AJAX
            if request.is_json:
                return jsonify({"success": False, "message": "Credenciais inválidas. Tente novamente."})
            else:
                # Usa flash para mensagens de erro em requisições tradicionais
                flash("Credenciais inválidas. Tente novamente.")
                return render_template('login.html')
    
    # Renderiza o template de login para requisições GET
    return render_template('login.html')

# Rota de cadastro
@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        # Verifica se os dados foram enviados como JSON (para requisições AJAX)
        if request.is_json:
            data = request.get_json()
            nome = data.get('nome')
            senha = data.get('senha')
        else:
            # Caso contrário, assume que os dados foram enviados via formulário tradicional
            nome = request.form.get('nome')
            senha = request.form.get('senha')
        
        try:
            usuario = gerenciador.buscar_usuario(nome)
        
            if usuario.nome == nome and usuario.senha == senha:
                return jsonify({"success": False, "message": "Usuário existente!"})
            
            gerenciador.adicionar_usuario(nome, senha)
            
            # Retorna uma resposta JSON para requisições AJAX
            if request.is_json:
                return jsonify({
                    "success": True,
                    "message": "Cadastro realizado com sucesso! Faça login.",
                    "redirect": url_for('login')
                })
            else:
                # Usa flash para mensagens de sucesso em requisições tradicionais
                flash("Cadastro realizado com sucesso! Faça login.")
                return redirect(url_for('login'))
        except ValueError as e:
            # Retorna uma resposta JSON para requisições AJAX
            if request.is_json:
                return jsonify({
                    "success": False,
                    "message": str(e)
                })
            else:
                # Usa flash para mensagens de erro em requisições tradicionais
                flash(str(e))
                return render_template('cadastro.html')
    
    # Renderiza o template de cadastro para requisições GET
    return render_template('cadastro.html')

# Rota da página principal (após login)
@app.route('/principal')
def principal():
    if 'usuario_id' not in session:
        return redirect(url_for('login'))
    return render_template('principal.html', nome=session['usuario_nome'])

# Rota para adicionar transação
@app.route('/adicionar_transacao', methods=['POST'])
def adicionar_transacao():
    if 'usuario_id' not in session:
        return redirect(url_for('login'))
    
    descricao = request.form['descricao']
    valor = float(request.form['valor'])
    tipo = request.form['tipo']
    
    try:
        gerenciador.adicionar_transacao(session['usuario_id'], descricao, valor, tipo)
        flash("Transação adicionada com sucesso!")
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

# Rota para consultar saldo
@app.route('/consultar_saldo')
def consultar_saldo():
    if 'usuario_id' not in session:
        return redirect(url_for('login'))
    
    saldo = gerenciador.consultar_saldo(session['usuario_id'])
    return jsonify({"saldo": saldo})

# Rota para listar transações
@app.route('/listar_transacoes')
def listar_transacoes():
    if 'usuario_id' not in session:
        return redirect(url_for('login'))
    
    transacoes = gerenciador.listar_transacoes(session['usuario_id'])
    return jsonify({"transacoes": [
        {"descricao": t.descricao, "valor": t.valor, "tipo": t.tipo} for t in transacoes
    ]})

# Rota de logout
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)