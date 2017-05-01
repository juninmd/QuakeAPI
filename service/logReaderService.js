module.exports = {
    readFile: (filename) => {
        return new Promise((resolve, reject) => {
            var fs = require('fs');
            fs.readFile(filename, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                /**
                 * É feito um tratamento com o texto devolvido
                 * Gerando um array de texto
                 */
                resolve(data.trim().split('\n'));
            });
        })
    }
}