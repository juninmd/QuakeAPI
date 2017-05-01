var logParserService = require('./logParserService');

module.exports = {
    getGames: () => logParserService.getParsedFile()
}