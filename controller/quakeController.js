var quakeService = require('../service/quakeService');

module.exports = (app) => {
    app.route("/api/games").get((req, res) => {
        quakeService.getGames()
            .then(e => res.status(200).send(e))
            .catch(e => res.status(500).send(e))
    });
}