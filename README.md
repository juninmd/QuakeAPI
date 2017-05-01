# Quake log parser

## Por que Node? ##
Pela simplicidade e rapidez do projeto.

## Requisitos ##
Node https://nodejs.org/en/  
Yarn (Opcional) https://yarnpkg.com/pt-BR/  

## Instalação ##
Após clonar o repositório, utilize o comando via terminal  
`npm install` ou `yarn` para baixar os pacotes de dependências.   

## API ##
Utilizando o comando `node app` a aplicação rodará no seguinte endereço:  
`http://localhost:4500/api/games`  
*Observação: Será o padrão caso as variáveis de ambiente   
`process.env.URL` e `process.env.PORT` não estejam setadas.  
E caso queira importar via `postman`  
`curl -X GET -H "Cache-Control: no-cache" -H "Postman-Token: 7c1da1db-1658-1697-e39b-9f9bd4bcd3bb" "http://localhost:4500/api/games"`  

## Executar testes unitários ##
É necessário do mocha instalado  
`npm install -g mocha`  
Tendo o mocha instalado, estando na raiz do projeto, utilize o comando via npm:  
`npm test`
