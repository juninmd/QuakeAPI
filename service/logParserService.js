var logReaderService = require('./logReaderService');

module.exports = {
    getParsedFile: () => {
        return new Promise((resolve, reject) => {
            logReaderService.readFile(`./games.log`).then(data => {
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
    }
}

function parseFile(lines) {
    let rounds = 0;
    let root = {};
    let players = [];
    lines.forEach((x) => {
        if (x.indexOf('InitGame') !== -1) {
            rounds = getInitGame(root, rounds);
        }

        if (x.indexOf('killed') !== -1) {
            kill(root[`game_${rounds}`], x);
        }

        if (x.indexOf('ClientUserinfoChanged') !== -1)
            instancePlayers(root[`game_${rounds}`], x);
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

function instancePlayers(round, x) {
    let playername = x.split('n\\')[1].split('\\t')[0];
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

function kill(round, x) {
    round.total_kills++;
    getKills(round.kills, x);
}

function getKills(kills, x) {

    // Suícidio
    if (x.indexOf('<world>') !== -1) {
        let killed = x.split('killed')[1].split('by')[0].trim();
        instanceKills(kills, killed);
        kills[killed]--;
    }
    else {
        let killer = x.split('killed')[0].split(':')[3].trim();
        let killed = x.split('killed')[1].split('by')[0].trim();

        instanceKills(kills, killed);
        instanceKills(kills, killer);

        if (killer != killed)
            kills[killer]++;
    }

}