# Quake Log Parser API

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Mocha](https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=Mocha&logoColor=white)

Uma API REST desenvolvida em Node.js para ler e interpretar logs de partidas de Quake 3 Arena, retornando um agrupamento de dados organizados com estatísticas dos jogadores.

## 📑 Tabela de Conteúdos

- [Por que Node?](#-por-que-node)
- [Requisitos](#-requisitos)
- [Instalação](#-instalação)
- [Como usar (API)](#-como-usar-api)
- [Testes](#-testes)

## 💡 Por que Node?
Pela simplicidade, natureza assíncrona e rapidez que o ecossistema Node.js proporciona para leitura de arquivos e criação de serviços web.

## ⚙️ Requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:
- [Node.js](https://nodejs.org/en/) (Recomendado versão LTS)
- [Yarn](https://yarnpkg.com/pt-BR/) (Opcional, você pode usar o npm)

## 🚀 Instalação

1. Clone este repositório para a sua máquina.
2. Acesse a pasta do projeto via terminal.
3. Instale as dependências executando um dos comandos abaixo:

```bash
npm install
# ou
yarn install
```

## 🌐 Como usar (API)

Para iniciar o servidor, execute o seguinte comando:

```bash
node app.js
```

A aplicação será iniciada e estará disponível no seguinte endereço:
`http://localhost:4500/`

> **Observação:** Esta será a configuração padrão caso as variáveis de ambiente `process.env.URL`, `process.env.PORT` e `process.env.VERSION` não estejam definidas.

### Endpoints Disponíveis

Você pode utilizar ferramentas como **Postman**, **Insomnia** ou **cURL** para consumir os endpoints.

**1. Listar todas as partidas:**
```bash
curl -X GET -H "Cache-Control: no-cache" "http://localhost:4500/api/v1/games"
```

**2. Listar dados de uma partida específica (ex: partida 1):**
```bash
curl -X GET -H "Cache-Control: no-cache" "http://localhost:4500/api/v1/games/1"
```

## 🧪 Testes

O projeto utiliza o **Mocha** para a execução de testes unitários.

Para rodar os testes, certifique-se de que o Mocha está instalado (pode ser globalmente ou via dependências do projeto) e execute o comando:

```bash
npm test
```
