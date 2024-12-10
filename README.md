![Compass UOL](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjETy0VOzv6gXdQZlWfiNFwK9qTxnPI8Obzw&s)

# 🚘 CompassCar API
API desenvolvida para locação de veiculos.

## **Índice**
- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Executar o Projeto](#como-executar-o-projeto)
- [Endpoints](#endpoints)
- [Funcionalidades](#funcionalidades)
- [Melhorias Futuras](#melhorias-futuras-previstas)

---

## **Sobre o Projeto**
Esta API tem como objetivo gerenciar as operações de locação de veiculos, permitindo:
- Cadastro e autenticação de usuários.
- Cadastro de clientes.
- Cadastro de veiculos.
- Gerenciamento de locação de veiculos por usuario.

A aplicação foi projetada para ser prática e escalável, usando boas práticas de desenvolvimento com o **NestJS**.

---

## **Tecnologias Utilizadas**
- **Backend**: NestJS
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT
- **Docker**
- **Validação de Dados**: Class-validator
- **Gerenciamento de Dependências**: NPM
- **Testes** : Jest e Supertest

---

## **Como Executar o Projeto**

### **1. Pré-requisitos**
Certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- Docker
- [Postman](https://www.postman.com/) ou outra ferramenta para testar a API

### **2. Clonar o Repositório**
```bash
git clone https://github.com/seu-usuario/biblioteca-api.git
cd biblioteca-api
```

### **3. Instalar Dependências**
```bash
npm install
```
### **4. Configurar Variáveis de Ambiente**
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:
```dotenv
POSTGRES_PASSWORD=
DATABASE_URL=
```
### **5. Iniciar Bando de Dados via Docker**
```bash
docker-compose up -d
```
### **6. Executar as Migrações**
```bash
npx prisma generate
```
### **6.1. Carregar Seeds para Banco de Dados**
```bash
npm run seed
```
### **7. Iniciar o Servidor**
```bash
npm run start:dev
```
A API estará disponível em http://localhost:3000.
___
## **Como testar o projeto (e2e)**
### **1. Rodar script pretest**
```bash
npm run pretest:int
```
### **2. Rodar teste**
```bash
npm run test:e2e
```
___
## **Endpoints**
Abaixo estão os principais endpoints da API:

     *Todas rotas privadas precisam de autenticação para ser acessadas.

### **Autenticação (publica)**
```http
POST /auth/register: Cadastrar usuário.
POST /auth/login: Autenticar usuario e gerar token JWT.
```

### **Usuários (privada)**
```http
POST /users: Criar um novo usuario.
GET /users: Listar todos os usuarios cadastrados.
GET /users/:id: Listar usuario pelo id.
PATCH /users/id: Atualizar as informações do usuario.
DELETE /users/:id: Cancelar cadastro do usuario.
```

### **Carros (privada)**
```http
POST /cars: Criar um novo carro.
GET /cars: Listar todos os carros cadastrados.
GET /cars/:id: Listar carro pelo id.
PATCH /cars/id: Atualizar as informações do carro.
DELETE /cars/:id: Cancelar cadastro do carro.
```

### **Pedidos (privada)**
```http
POST /orders: Criar um novo pedido.
GET /orders: Listar todos os pedidos cadastrados.
GET /orders/:id: Listar pedido pelo id.
PATCH /orders/id: Atualizar as informações do pedido.
DELETE /orders/:id: Cancelar cadastro do pedido.
```
___
## **Funcionalidades**
### ✅ **Autentificação**
- Cadastro, autenticação com JWT.
### ✅ **Usuários**
- CRUD completo de usuarios com validação e filtros dinâmicos.
### ✅ **Carros**
- CRUD completo de usuarios com validação e filtros dinâmicos.
### ✅ **Pedidos**
- CRUD completo de pedidos, com o gerenciamento sobre os carros locados para clientes.
___
## **Melhorias Futuras ***Previstas*****
- [ ] Desenvolver uma interface frontend para interação com a API.
