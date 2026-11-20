var path = require('path');
var logReaderService = require('./logReaderService');

// Resolve pelo diretorio do projeto: com caminho relativo, iniciar a API fora da raiz dava ENOENT.
const LOG_FILE = path.join(__dirname, '..', 'games.log');

module.exports = {
    getParsedFile: () => {
        return new Promise((resolve, reject) => {
            logReaderService.readFile(LOG_FILE).then(data => {
                let parsedFile = parseFile(data);
                return resolve(parsedFile);
            }).catch(err => {
                return reject(err)
            });
        })
    },
    getInitGame: (root, rounds) => {
        return getInitGame(root, rounds);
    },
    getKill: (round, x) => {
        return kill(round, x);
    },
    getPlayer: (round, x) => {
        return instancePlayers(round, x);
    },
    parseFile: (lines) => parseFile(lines)
}

const KILL_LINE = /^\s*\d+:\d+ Kill: /;

function parseFile(lines) {
    let rounds = 0;
    let root = {};
    let players = [];
    lines.forEach((x) => {
        if (x.indexOf('InitGame') !== -1) {
            rounds = getInitGame(root, rounds);
        }

        // Log rotacionado/truncado pode ter eventos antes do primeiro InitGame; sem partida aberta, ignora.
        const round = root[`game_${rounds}`];
        if (!round) return;

        if (KILL_LINE.test(x)) {
            kill(round, x);
        }

        if (x.indexOf('ClientUserinfoChanged') !== -1)
            instancePlayers(round, x);
    });
    return root;
}

function getInitGame(root, rounds) {
    root[`game_${++rounds}`] = {
        total_kills: 0,
        players: [],
        kills: {}
    }
    return rounds;
}

// Linha truncada/sem o campo n\ nao pode derrubar o parse do log inteiro.
const PLAYER_NAME = /ClientUserinfoChanged: \d+ n\\([^\\]*)/;

function instancePlayers(round, x) {
    const match = PLAYER_NAME.exec(x);
    if (!match) return;
    let playername = match[1];
    getPlayers(round.players, playername);
    instanceKills(round.kills, playername);
}

function getPlayers(players, playername) {
    if ((players.indexOf(playername) === -1)) {
        players.push(playername);
    }
}

function instanceKills(kills, playername) {
    if (kills[playername] == null) {
        kills[playername] = 0;
    }
}

// Nomes podem conter "by" ou "killed" (ex.: "Bobby"); ancora na estrutura da linha e na MOD final.
const KILL_PARSE = /Kill: \d+ \d+ \d+: (.+?) killed (.+) by \S+\s*$/;

function kill(round, x) {
    const match = KILL_PARSE.exec(x);
    if (!match) return;
    round.total_kills++;
    getKills(round.kills, match[1], match[2]);
}

function getKills(kills, killer, killed) {
    instanceKills(kills, killed);

    // Suícidio
    if (killer === '<world>') {
        kills[killed]--;
        return;
    }

    instanceKills(kills, killer);
    if (killer !== killed)
        kills[killer]++;
}
