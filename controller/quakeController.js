var quakeService = require('../service/quakeService');
var webconfig = require('../webconfig');

module.exports = (app) => {
    app.route(`/api/v${webconfig.version}/games`).get((req, res) => {
        quakeService.getGames()
            .then(e => res.status(200).send(e))
            .catch(e => res.status(e.statusCode || 500).send(e))
    });

    app.route(`/api/v${webconfig.version}/games/:game`).get((req, res) => {
        quakeService.getGame(req.params.game)
            .then(e => res.status(200).send(e))
            .catch(e => res.status(e.statusCode || 500).send(e))
    });
}