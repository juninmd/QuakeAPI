var supertest = require('supertest');
var app = require('../app');
var should = require("should");

describe("--= Api =--", () => {

    it("request de todos os jogos", (done) => {
        supertest(app)
            .get("/api/games")
            .expect(200)
            .end((err, res) => {
                res.status.should.equal(200);
                res.body.should.have.property('game_1');
                done();
            });
    });
});