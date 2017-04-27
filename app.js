require('./service/logParser')((err, data) => {
    if (err) {
        console.log("ERRO");
    }
    else {
        console.log(data);
    }
})