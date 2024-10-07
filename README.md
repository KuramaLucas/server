# API de Vendas e Gerenciamento de Usuários, Lojas e Produtos

## Descrição
Esta API foi desenvolvida utilizando **TypeScript** e **Prisma** como ORM, permitindo a criação, leitura, atualização e exclusão (CRUD) de **Produtos**, **Lojas**, **Usuários** e **Vendas**. A API possui autenticação por token JWT, criptografia de senhas e foi testada utilizando o **Insomnia**.

---

## Funcionalidades

- **Usuários:**
  - Criar novos usuários.
  - Obter a lista de todos os usuários.
  - Deletar usuários.
  - Criptografia de senhas utilizando **bcrypt**.
  - Autenticação via **JWT**.

- **Lojas:**
  - Criar novas lojas.
  - Listar todas as lojas.
  - Deletar lojas.

- **Produtos:**
  - Criar novos produtos.
  - Listar todos os produtos.
  - Associar produtos a lojas.
  - Deletar produtos.

- **Vendas:**
  - Criar novas vendas (associando produtos a usuários e lojas).
  - Obter a lista de todas as vendas.
  - Deletar vendas.

---

## Tecnologias Utilizadas

- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: JWT (JSON Web Token)
- **Criptografia**: Bcrypt
- **Testes**: Insomnia

---

## Rotas da API

### **Usuários**

- `POST /users`: Cria um novo usuário.
- `GET /users`: Retorna a lista de todos os usuários.
- `DELETE /users/:id`: Deleta um usuário específico.

### **Lojas**

- `POST /stores`: Cria uma nova loja.
- `GET /stores`: Retorna todas as lojas.
- `DELETE /stores/:id`: Deleta uma loja específica.

### **Produtos**

- `POST /products`: Cria um novo produto e associa a uma loja.
- `GET /products`: Retorna todos os produtos.
- `DELETE /products/:id`: Deleta um produto específico.

### **Vendas**

- `POST /sales`: Cria uma nova venda (associa produto a um usuário).
- `GET /sales`: Retorna todas as vendas.
- `DELETE /sales/:id`: Deleta uma venda específica.

---

## Autenticação e Segurança

A API utiliza **JWT** para autenticação de usuários e protege as rotas sensíveis. Para acessar a maioria das rotas, o usuário deve estar autenticado e fornecer o token de autorização no cabeçalho da requisição.

- **Criptografia de Senhas**: As senhas dos usuários são criptografadas utilizando **bcrypt** antes de serem armazenadas no banco de dados.
