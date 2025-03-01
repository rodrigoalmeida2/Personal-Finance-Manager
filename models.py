from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

# 🔹 Modelo de Usuário atualizado com senha
class Usuario(Base):
    __tablename__ = 'usuarios'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(100), nullable=False, unique=True)
    senha = Column(String(15), nullable=False)  # Armazena a senha diretamente (apenas para teste)
    saldo = Column(Float, default=0.0)
    transacoes = relationship("Transacao", back_populates="usuario")

# 🔹 Modelo de Transação
class Transacao(Base):
    __tablename__ = 'transacoes'
    id = Column(Integer, primary_key=True, autoincrement=True)
    descricao = Column(String(200), nullable=False)
    valor = Column(Float, nullable=False)
    tipo = Column(String(10), nullable=False)  # "receita" ou "despesa"
    usuario_id = Column(Integer, ForeignKey('usuarios.id'))
    usuario = relationship("Usuario", back_populates="transacoes")
    categoria_id = Column(Integer, ForeignKey('categorias.id'))
    categoria = relationship("Categoria", back_populates="transacoes")

# 🔹 Modelo de Categoria
class Categoria(Base):
    __tablename__ = 'categorias'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(50), nullable=False)
    transacoes = relationship("Transacao", back_populates="categoria")
