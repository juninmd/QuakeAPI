module.exports = (req, res, next) => {
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, User-Agent");
    res.header("Access-Control-Allow-Methods", "GET");

    if (req.method === 'OPTIONS') {
        res.status(200).send();
        return;
    }
    next();
};