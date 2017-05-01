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
`http://localhost:4500/`    
*Observação: Será o padrão caso as variáveis de ambiente   
`process.env.URL`, `process.env.PORT` e `process.env.VERSION` não estejam setadas.    
E caso queira importar via `postman` os métodos disponíveis são:    
`curl -X GET -H "Cache-Control: no-cache" -H "Postman-Token: 8c711661-65a1-b5ef-7baf-866bad79ec6c" "http://localhost:4500/api/v1/games"`  
`curl -X GET -H "Cache-Control: no-cache" -H "Postman-Token: 549ab0ae-74cd-4918-d9a2-e663e8937c73" "http://localhost:4500/api/v1/games/1"`
 

## Executar testes unitários ##
É necessário ter o mocha instalado  
`npm install -g mocha`  
Estando na raiz do projeto, utilize o comando via npm:  
`npm test`
