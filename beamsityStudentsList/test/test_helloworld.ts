import chai = require('chai')
import chaiHttp = require('chai-http')
import * as express from "express"

import { studentsRecord } from '../src/index'

const app = express()
app.get('/', studentsRecord)

chai.use(chaiHttp)
const expect = chai.expect

describe('Hello function', () => {
    it('Get 200 response', function (done) {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                expect(err).to.be.null
                expect(res.text).to.be.equal('Hello World')
                expect(res).to.have.status(200)
                done()
            })
    })
})