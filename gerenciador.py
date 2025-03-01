from sqlalchemy.orm import sessionmaker
from models import Usuario, Transacao, Categoria

class GerenciadorFinancas:
    def __init__(self, engine):
        self.engine = engine
        Session = sessionmaker(bind=engine)
        self.session = Session()

    # 🔹 Adicionar usuário com senha simples
    def adicionar_usuario(self, nome, senha):
        if self.session.query(Usuario).filter_by(nome=nome).first():
            raise ValueError("Nome de usuário já existe")

        usuario = Usuario(nome=nome, senha=senha)  # Sem hash, apenas para teste
        self.session.add(usuario)
        self.session.commit()
        return usuario

    # 🔹 Buscar usuário pelo nome
    def buscar_usuario(self, nome):
        return self.session.query(Usuario).filter_by(nome=nome).first()

    # 🔹 Adicionar transação (agora requer autenticação)
    def adicionar_transacao(self, usuario_id, descricao, valor, tipo):
        usuario = self.session.query(Usuario).filter_by(id=usuario_id).first()
        if not usuario:
            raise ValueError("Usuário não encontrado")

        # Verifica se a categoria já existe
        categoria = self.session.query(Categoria).filter_by(nome=descricao).first()
        if not categoria:
            # Cria uma nova categoria se não existir
            categoria = Categoria(nome=descricao)
            self.session.add(categoria)
            self.session.commit()

        # Cria a transação com a categoria existente ou nova
        transacao = Transacao(
            descricao=descricao,
            valor=valor,
            tipo=tipo,
            usuario_id=usuario_id,
            categoria_id=categoria.id
        )
        self.session.add(transacao)

        # Atualiza o saldo do usuário
        if tipo == "receita":
            usuario.saldo += valor
        elif tipo == "despesa":
            usuario.saldo -= valor

        self.session.commit()
        return transacao

    # 🔹 Consultar saldo do usuário autenticado
    def consultar_saldo(self, usuario_id):
        usuario = self.session.query(Usuario).filter_by(id=usuario_id).first()
        if not usuario:
            raise ValueError("Usuário não encontrado")
        return usuario.saldo

    # 🔹 Listar transações do usuário autenticado
    def listar_transacoes(self, usuario_id):
        return self.session.query(Transacao).filter_by(usuario_id=usuario_id).all()
