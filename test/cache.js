var should = require("should");
var path = require('path');
var fs = require('fs');
var logReaderService = require('../service/logReaderService');
var logParserService = require('../service/logParserService');

describe("--= Cache do log =--", () => {

    it("Só relê o games.log quando o arquivo muda", async () => {
        const file = path.join(__dirname, '..', 'games.log');
        const original = logReaderService.readFile;
        const { atime, mtime } = fs.statSync(file);
        let reads = 0;
        logReaderService.readFile = (f) => { reads++; return original(f); };
        try {
            fs.utimesSync(file, atime, new Date(mtime.getTime() + 1000));
            const first = await logParserService.getParsedFile();
            const second = await logParserService.getParsedFile();
            second.should.equal(first);
            reads.should.equal(1);

            fs.utimesSync(file, atime, mtime);
            await logParserService.getParsedFile();
            reads.should.equal(2);
        } finally {
            logReaderService.readFile = original;
            fs.utimesSync(file, atime, mtime);
        }
    });
});
