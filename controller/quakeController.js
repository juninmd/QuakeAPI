var quakeService = require('../service/quakeService');
var webconfig = require('../webconfig');

// Error nao serializa em JSON (vira {}); falhas inesperadas viram um corpo padrao sem expor detalhes internos.
function sendError(res, e) {
    if (e && e.statusCode) return res.status(e.statusCode).send(e);
    console.error('[Quake API] - Falha ao processar o log:', e);
    return res.status(500).send({ erro: 'Não foi possível ler o log de partidas.', statusCode: 500 });
}

module.exports = (app) => {
    app.route(`/api/v${webconfig.version}/games`).get((req, res) => {
        quakeService.getGames()
            .then(e => res.status(200).send(e))
            .catch(e => sendError(res, e))
    });

    app.route(`/api/v${webconfig.version}/games/:game`).get((req, res) => {
        quakeService.getGame(req.params.game)
            .then(e => res.status(200).send(e))
            .catch(e => sendError(res, e))
    });
}