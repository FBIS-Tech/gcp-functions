"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const chaiHttp = require("chai-http");
const express = require("express");
const index_1 = require("../src/index");
const app = express();
app.get("/", index_1.salesTransactionReport);
chai.use(chaiHttp);
const expect = chai.expect;
describe("Hello function", () => {
    it("Get 200 response", function (done) {
        chai
            .request(app)
            .get("/")
            .end((err, res) => {
            done();
        });
    });
});
