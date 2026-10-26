var express = require("express");
var app = express();
var morgan = require('morgan');
var webconfig = require('./webconfig.js');

app.use(morgan(':method | :status | HTTP :http-version | Resposta: :response-time ms | Data: :date[web] | URL: :url'));
app.use(require('./cors.js'));

require('./controller/quakeController')(app);

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.', statusCode: 404 }));

// O listen so acontece quando o arquivo e o entrypoint; nos testes o app e
// importado direto pelo supertest e um servidor aberto seguraria o mocha.
if (require.main === module) {
    app.listen(webconfig.portApi, () => {
        console.log(`[Quake API] - Ativo :D | ${webconfig.urlApi}:${webconfig.portApi}`);
    });
}

module.exports = app;
