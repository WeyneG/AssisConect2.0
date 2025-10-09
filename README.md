# AssisConnect 2.0 (repo: **AssisConect2.0**)

<p align="center">
  <strong>Plataforma web para gestão de um lar recreativo de idosos — organização de dados, rotinas e comunicação da equipe.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js 20+">
  <img src="https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 4">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL 8">
  <img src="https://img.shields.io/badge/HTML-5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS-3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 18">
</p>

---

## Sobre o Projeto

O **AssisConnect 2.0** é um sistema **web** pensado para o dia a dia de um **lar recreativo de idosos**, permitindo centralizar cadastros, rotinas, agenda, cardápios, acompanhamentos e avisos.  
A proposta é ser simples para a equipe de cuidadores e, ao mesmo tempo, oferecer **rastreamento e histórico** para coordenação e relatórios.

Arquitetura em dois blocos:

- **Backend (API REST)**: `Node.js + Express` com autenticação, regras de negócio e persistência em **MySQL**.
- **Frontend (SPA leve)**: **React 18**, HTML/CSS/JS, consumindo a API via `fetch/Axios`, com foco em **desempenho e simplicidade**.

---

## Funcionalidades

- **Autenticação e Perfis**: Login com JWT, perfis (Admin, Cuidador, Visualizador).
- **Cadastro de Idosos**: Dados pessoais, contatos, restrições, documentos e anotações.
- **Agenda & Rotinas**: Tarefas por turno (manhã/tarde/noite), responsáveis, status e histórico.
- **Cardápio**: Planejamento semanal de refeições.
- **Avisos & Ocorrências**: Comunicados internos, observações e anexos.
- **Design Responsivo**: Layout adaptado para desktop e tablets.

---

## Demonstrações

> Substitua as imagens abaixo por capturas do seu projeto (pasta `docs/images`).

### **Login**
![login](docs/images/login.png)

### **Dashboard**
![dashboard](docs/images/dashboard.png)

### **Cadastro de Idoso**
![idoso](docs/images/idoso.png)

### **Agenda**
![agenda](docs/images/agenda.png)

### **Movimentações (com TRANSFERÊNCIA unificada)**
![movimentacao](docs/images/movimentacao.png)

---

## Pilha Tecnológica

| Camada      | Tecnologias |
|:------------|:------------|
| **Backend** | Node.js 20+, Express 4, JWT, bcrypt, MySQL 8, `dotenv`, `cors`, `morgan` |
| **Frontend**| React 18, React Router, Axios, HTML5, CSS3, JavaScript (ES2022) |
| **DevOps**  | npm scripts, `.env`, scripts SQL de inicialização |

---

## Guia de Instalação e Execução

Para executar o projeto localmente, siga os passos abaixo.

### Pré-requisitos

- **Node.js** e **npm** (versão 14 ou superior)
- **MySQL** ou servidor de banco de dados configurado
- **Git** (opcional para clonagem)

### 1) Backend

1. **Clone o repositório** ou faça o download do projeto:
    ```bash
    git clone https://github.com/WeyneG/AssisConect2.0.git
    cd AssisConect2.0/backend
    ```

2. **Instale as dependências**:
    - Se você estiver usando `npm`:
      ```bash
      npm install
      ```

3. **Inicie a aplicação**:
    - Execute o seguinte comando para rodar o servidor:
      ```bash
      npm run dev  
      ```

4. A API estará disponível em `http://localhost:8080`.

### 2) Frontend

1. **Acesse o diretório do frontend**:
    ```bash
    cd frontend
    ```

2. **Instale as dependências**:
    - Execute:
      ```bash
      npm install
      ```

3. **Inicie o servidor de desenvolvimento**:
    - Execute o comando abaixo:
      ```bash
      npm run dev
      ```


