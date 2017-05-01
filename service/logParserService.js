module.exports = () => {
    return new Promise((resolve, reject) => {
        require('./logReaderService')((err, data) => {
            if (err) {
                reject(err);
                return;
            }
            let parsedFile = parseFile(data);
            resolve(parsedFile);
        });
    })
}

function parseFile(lines) {
    let rounds = 0;
    let retorn = {};
    let players = [];
    lines.forEach((x) => {
        if (x.indexOf('InitGame') !== -1) {
            retorn[`game_${++rounds}`] = {
                total_kills: 0,
                players: [],
                kills: {}
            }
        }

        if (x.indexOf('killed') !== -1) {
            retorn[`game_${rounds}`].total_kills++;
            getKills(retorn[`game_${rounds}`].kills, x);
        }

        if (x.indexOf('ClientUserinfoChanged') !== -1)
            instancePlayers(retorn[`game_${rounds}`], x);
    });
    return retorn;
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

function getKills(kills, x) {

    // Suícidio
    if (x.indexOf('<world>') !== -1) {
        let killed = x.split('killed')[1].split('by')[0].trim();
        if (kills[killed] == null) {
            kills[killed] = 0;
        }
        kills[killed]--;
    }
    else {
        let killer = x.split('killed')[0].split(':')[3].trim();
        let killed = x.split('killed')[1].split('by')[0].trim();

        if (kills[killer] == null) {
            kills[killer] = 0;
        }
        if (killer != killed)
            kills[killer]++;
    }

}