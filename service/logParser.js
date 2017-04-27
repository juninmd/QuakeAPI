module.exports = (callback) => {
    require('./logReader')((err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        else {

            let kills = totalKills(data);

            let retorn = {};
            retorn["game_1"] = { totalKills: kills };

            callback(null, data);
        }
    })

}

function totalKills(lines) {
    let total = 0;
    lines.forEach((x) => {
        if (x.indexOf('killed') != -1)
            return total++;
    });
    return total;
}

function getPlayersKills() {

}