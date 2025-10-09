# AssisConnect 2.0 (repo: **AssisConect2.0**)

<p align="center">
  <strong>Plataforma web para gestão de um lar recreativo de idosos — organização de dados, rotinas e comunicação da equipe.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-007396?style=for-the-badge&logo=java&logoColor=white" alt="Java 21">
  <img src="https://img.shields.io/badge/Spring_Boot-3.4.5-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Boot 3">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL 8">
  <img src="https://img.shields.io/badge/HTML-5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS-3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
</p>

---

## Sobre o Projeto

O **AssisConnect 2.0** é um sistema **web** pensado para o dia a dia de um **lar recreativo de idosos**, permitindo centralizar cadastros, rotinas, agenda, cardápios, acompanhamentos e avisos.  
A proposta é ser simples para a equipe de cuidadores e, ao mesmo tempo, oferecer **rastreamento e histórico** para coordenação e relatórios.

Arquitetura em dois blocos:

- **Backend (API REST)**: `Java + Spring Boot` com autenticação, regras de negócio e persistência em **MySQL**.
- **Frontend (SPA leve)**: **HTML/CSS/JS vanilla** consumindo a API via `fetch/Axios`, com foco em **desempenho e simplicidade**.

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
| **Backend** | Java 21, Spring Boot 3.4.5, Spring Security, Spring Data JPA, MySQL 8, Maven |
| **Frontend**| HTML5, CSS3, JavaScript (ES2022), Fetch/Axios |
| **DevOps**  | Maven, `.env`, scripts SQL de inicialização |

---

## Guia de Instalação e Execução

Para executar o projeto localmente, siga os passos abaixo.

### Pré-requisitos

- **Java 21** ou superior
- **Maven** para construção do projeto
- **MySQL** ou servidor de banco de dados configurado
- **Git** (opcional para clonagem)

### 1) Executar


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

---

