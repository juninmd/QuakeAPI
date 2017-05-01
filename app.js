var express = require("express");
var app = express();
var morgan = require('morgan');
var webconfig = require('./webconfig.js');
var expressLoad = require('express-load');

app.use(morgan(':method | :status | HTTP :http-version | Resposta: :response-time ms | Data: :date[web] | URL: :url'));
app.use(require('./cors.js'));

expressLoad('controller')
    .into(app);

app.listen(webconfig.portApi, () => {
    console.log(`[Quake API] - Ativo :D | ${webconfig.urlApi}:${webconfig.portApi}`);
});

module.exports = app;