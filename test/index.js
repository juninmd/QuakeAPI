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

describe("--= Http =--", () => {

    it("Rota inexistente responde 404 em JSON", () => {
        return supertest(app)
            .get(`/api/v${webconfig.version}/nada`)
            .expect('Content-Type', /application\/json/)
            .expect(404)
            .then(res => {
                res.body.should.have.property('statusCode').equal(404);
                res.body.should.have.property('erro');
            });
    });

    it("Pré-flight OPTIONS responde 204 com cabeçalhos CORS", () => {
        return supertest(app)
            .options(`/api/v${webconfig.version}/games`)
            .expect(204)
            .then(res => {
                res.headers.should.have.property('access-control-allow-origin').equal('*');
            });
    });
});

describe("--= Parser =--", () => {

    it("Linhas que não são Kill (nome ou chat com 'killed') não derrubam o parse", () => {
        const root = logParserService.parseFile([
            ' 0:00 InitGame: \\mapname\\q3dm17',
            ' 0:10 ClientUserinfoChanged: 2 n\\killed\\t\\0\\model\\x',
            ' 0:20 say: "Bob": who killed me?',
        ]);
        root.game_1.total_kills.should.equal(0);
        root.game_1.players.should.containEql('killed');
    });
});

describe("--= Parser (log truncado) =--", () => {

    it("Eventos antes do primeiro InitGame são ignorados em vez de derrubar o parse", () => {
        const root = logParserService.parseFile([
            ' 0:05 ClientUserinfoChanged: 2 n\\Bob\\t\\0\\model\\x',
            ' 0:06 Kill: 1 2 7: Alice killed Bob by MOD_ROCKET',
            ' 0:10 InitGame: \\mapname\\q3dm17',
            ' 0:20 ClientUserinfoChanged: 2 n\\Alice\\t\\0\\model\\x',
        ]);
        Object.keys(root).should.eql(['game_1']);
        root.game_1.total_kills.should.equal(0);
        root.game_1.players.should.eql(['Alice']);
    });
});

describe("--= Módulos =--", () => {

    it("Lê o games.log mesmo com a API iniciada fora da raiz do projeto", () => {
        const cwd = process.cwd();
        process.chdir(require('os').tmpdir());
        return logParserService.getParsedFile()
            .then(root => Object.keys(root).length.should.equal(21))
            .finally(() => process.chdir(cwd));
    });

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

describe("--= Parser (nomes com 'by' ou 'killed') =--", () => {

    it("Jogador com 'by' no nome é contabilizado com o nome completo", () => {
        const root = logParserService.parseFile([
            ' 0:00 InitGame: \\mapname\\q3dm17',
            ' 0:10 Kill: 2 3 7: Bobby killed Gabby by MOD_ROCKET',
            ' 0:11 Kill: 1022 3 22: <world> killed Gabby by MOD_TRIGGER_HURT',
        ]);
        root.game_1.total_kills.should.equal(2);
        root.game_1.kills.should.eql({ Bobby: 1, Gabby: -1 });
    });

    it("Linha Kill malformada é ignorada sem lançar nem contar", () => {
        const root = logParserService.parseFile([
            ' 0:00 InitGame: \\mapname\\q3dm17',
            ' 0:10 Kill: 2 3 7: sem formato',
        ]);
        root.game_1.total_kills.should.equal(0);
    });
});
