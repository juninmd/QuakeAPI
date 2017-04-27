module.exports = (callback) => {
    require('./logReader')((err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        else {

            let parsedFile = parseFile(data);

            callback(null, parsedFile);
        }
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
            getPlayers(retorn[`game_${rounds}`].players, x);
    });
    return retorn;
}

function getPlayers(players, x) {
    let playername = x.split('n\\')[1].split('\\t')[0];
    if ((players.indexOf(playername) === -1)) {
        players.push(playername);
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