"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const chaiHttp = require("chai-http");
const express = require("express");
const index_1 = require("../src/index");
const app = express();
app.get("/", index_1.salesTranscationReport);
chai.use(chaiHttp);
const expect = chai.expect;
describe("Hello function", () => {
    it("Get 200 response", function (done) {
        chai
            .request(app)
            .get("/")
            .end((err, res) => {
            expect(err).to.be.null;
            expect(res.text).to.be.equal("Hello World");
            expect(res).to.have.status(200);
            done();
        });
    });
});
