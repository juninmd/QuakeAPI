var logParserService = require('./logParserService');

module.exports = {
    getGames: () => logParserService.getParsedFile(),
    getGame: (game) => {
        return new Promise((resolve, reject) => {
            logParserService.getParsedFile()
                .then(data => {
                    let gameName = `game_${game}`;
                    if (data[gameName] != null) {
                        return resolve(data[gameName]);
                    }
                    return reject({
                        erro: 'Esse game não foi encontrado em nosso log.',
                        statusCode: 404
                    });
                })
                .catch(err => {
                    return reject(err);
                })
        })
    }
}