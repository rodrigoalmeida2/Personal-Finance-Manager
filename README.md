# Finance Management System

This is a simple finance management system using Flask, SQLAlchemy, and MySQL. The system allows users to register, log in, and manage their transactions, including tracking their income and expenses.

## Features
- User registration with username and password
- User authentication
- Add and list transactions (income and expenses)
- Check user balance
- MySQL database integration with SQLAlchemy

## Technologies Used
- Python
- Flask
- SQLAlchemy
- MySQL
- JavaScript
- HTML/CSS

## Installation

### Prerequisites
Ensure you have the following installed:
- Python 3.x
- MySQL Server
- pip (Python package manager)

### Clone the Repository
```sh
git clone https://github.com/rodrigoalmeida2/Personal-Finance-Manager.git
```

### Install Dependencies
```sh
pip install -r requirements.txt
```

### Database Setup
1. Open MySQL and create a database:
```sql
CREATE DATABASE finance;
```
2. Update the database configuration in `app.py`:
```python
DATABASE_URL = "mysql+pymysql://user:password@localhost/DATABASE"
```
3. Run the following script to initialize the database:
```sh
python init_db.py
```

## Running the Application
Start the Flask server:
```sh
python app.py
```
The server will start at `http://127.0.0.1:5000/`

## API Endpoints

### Register a User
**POST** `/adicionar_usuario`
- **Params**: `nome`, `senha`
- **Response**:
```json
{
  "id": 1,
  "nome": "JohnDoe"
}
```

### Add Transaction
**POST** `/adicionar_transacao`
- **Params**: `nome`, `descricao`, `valor`, `tipo`
- **Response**:
```json
{
  "id": 1,
  "descricao": "Salary",
  "valor": 5000,
  "tipo": "receita"
}
```

### Get User Balance
**GET** `/consultar_saldo/<usuario_id>`
- **Response**:
```json
{
  "saldo": 4500
}
```

### List Transactions
**GET** `/listar_transacoes/<usuario_id>`
- **Response**:
```json
[
  { "id": 1, "descricao": "Salary", "valor": 5000, "tipo": "receita" },
  { "id": 2, "descricao": "Rent", "valor": -500, "tipo": "despesa" }
]
```

## License
This project is licensed under the MIT License.


