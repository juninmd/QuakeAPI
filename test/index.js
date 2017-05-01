var supertest = require('supertest');
var app = require('../app');
var should = require("should");
var logReaderService = require('../service/logReaderService');
var logParserService = require('../service/logParserService');
var webconfig = require('../webconfig');

describe("--= Api =--", () => {

    it("Request de todos os jogos", (done) => {
        supertest(app)
            .get(`/api/v${webconfig.version}/games`)
            .expect(200)
            .end((err, res) => {
                res.status.should.equal(200);
                res.body.should.have.property('game_1');
                res.body.should.have.property('game_21');
                Object.keys(res.body).length.should.equal(21);
                done();
            });
    });

    it("Request do jogo 1", (done) => {
        supertest(app)
            .get(`/api/v${webconfig.version}/games/1`)
            .expect(200)
            .end((err, res) => {
                res.status.should.equal(200);
                res.body.should.have.property('total_kills').equal(0);
                res.body.should.have.property('kills');
                res.body["kills"].should.have.property('Isgalamido').equal(0);
                done();
            });
    });

    it("Request de um jogo que não existe", (done) => {
        supertest(app)
            .get(`/api/v${webconfig.version}/games/99`)
            .expect(200)
            .end((err, res) => {
                res.status.should.equal(404);
                res.body.should.have.property('statusCode').equal(404);
                done();
            });
    });
});

describe("--= Módulos =--", () => {

    it("Leitura do arquivo", () => {
        return logReaderService.readFile(`./test/read.log`).then(data => {
            should.exist(data);
        })
    });

    it("Nova partida", () => {
        let root = {};
        let data = logParserService.getInitGame(root, 0)
        should.exist(data);
        data.should.equal(1);
        root.should.have.property('game_1');
    });

    it("Verificar resultado de kill", () => {
        return logReaderService.readFile(`./test/killed.log`)
            .then(data => {
                should.exist(data);

                let root = {};
                logParserService.getInitGame(root, 0);
                logParserService.getKill(root.game_1, data.toString().trim());
                root["game_1"].should.have.property('total_kills').equal(1);
                root["game_1"].should.have.property('kills');
                root["game_1"]["kills"].should.have.property('Isgalamido').equal(1);
            })
    });

    it("Receber novo player ao server", () => {
        return logReaderService.readFile(`./test/newPlayer.log`)
            .then(data => {
                should.exist(data);

                let root = {};
                logParserService.getInitGame(root, 0);
                logParserService.getPlayer(root.game_1, data.toString().trim());
                root["game_1"].should.have.property('players').with.lengthOf(1);
                root["game_1"]["players"][0].should.equal('Dono da Bola');
                root["game_1"].should.have.property('kills');
                root["game_1"]["kills"].should.have.property('Dono da Bola').equal(0);
            })
    });
});