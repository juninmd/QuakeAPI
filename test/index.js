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

describe("--= Erros =--", () => {

    it("Falha inesperada na leitura responde 500 com corpo JSON útil", () => {
        const original = logParserService.getParsedFile;
        logParserService.getParsedFile = () => Promise.reject(new Error('ENOENT'));
        return supertest(app)
            .get(`/api/v${webconfig.version}/games`)
            .expect(500)
            .then(res => {
                res.body.should.have.property('statusCode').equal(500);
                res.body.should.have.property('erro');
            })
            .finally(() => { logParserService.getParsedFile = original; });
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

    it("Nomes como constructor/toString/__proto__ contam kills como qualquer outro", () => {
        const root = logParserService.parseFile([
            ' 0:00 InitGame: \\mapname\\q3dm17',
            ' 0:10 ClientUserinfoChanged: 2 n\\constructor\\t\\0',
            ' 0:11 ClientUserinfoChanged: 3 n\\toString\\t\\0',
            ' 0:12 ClientUserinfoChanged: 4 n\\__proto__\\t\\0',
            ' 0:20 Kill: 2 3 7: constructor killed toString by MOD_ROCKET_SPLASH',
            ' 0:21 Kill: 4 3 7: __proto__ killed toString by MOD_ROCKET_SPLASH',
        ]);
        const kills = root.game_1.kills;
        kills.constructor.should.equal(1);
        kills.toString.should.equal(0);
        Object.prototype.hasOwnProperty.call(kills, '__proto__').should.be.true();
        kills['__proto__'].should.equal(1);
    });

    it("ClientUserinfoChanged sem nome é ignorado em vez de derrubar o parse", () => {
        const root = logParserService.parseFile([
            ' 0:00 InitGame: \\mapname\\q3dm17',
            ' 0:01 ClientUserinfoChanged: 2 ',
            ' 0:02 ClientUserinfoChanged: 3 n\\Alice\\t\\0\\model\\x',
        ]);
        root.game_1.players.should.eql(['Alice']);
    });

    it("Nome terminado em 'n' não é truncado (ex.: 'Fasano Again')", () => {
        const root = logParserService.parseFile([
            ' 0:00 InitGame: \\mapname\\q3dm17',
            ' 0:01 ClientUserinfoChanged: 2 n\\Fasano Again\\t\\0\\model\\x',
            ' 0:02 Kill: 2 3 7: Fasano Again killed Zeh by MOD_ROCKET',
        ]);
        root.game_1.players.should.eql(['Fasano Again']);
        root.game_1.kills.should.eql({ 'Fasano Again': 1, Zeh: 0 });
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

describe("--= Parser (chat com nomes de eventos) =--", () => {

    it("Chat com 'InitGame'/'ClientUserinfoChanged' não cria partida nem jogador fantasma", () => {
        const root = logParserService.parseFile([
            ' 0:00 InitGame: \\mapname\\q3dm17',
            ' 0:01 ClientUserinfoChanged: 2 n\\Alice\\t\\0\\model\\x',
            ' 0:02 say: Alice: InitGame ClientUserinfoChanged: 5 n\\Ghost\\t\\0',
            ' 0:03 Kill: 1022 2 22: <world> killed Alice by MOD_TRIGGER_HURT',
        ]);
        Object.keys(root).should.eql(['game_1']);
        root.game_1.players.should.eql(['Alice']);
        root.game_1.total_kills.should.equal(1);
    });
});
