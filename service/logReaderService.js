module.exports = (callback) => {
    var fs = require('fs');
    fs.readFile(`./light.log`, 'utf8', (err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        /**
         * É feito um tratamento com o texto devolvido
         */
        callback(null, data.trim().split('\n'));
    });
}

