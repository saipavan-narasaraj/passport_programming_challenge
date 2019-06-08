/* 
    Testing  API's.
*/
process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../app.js');
const should = chai.should();


describe("TESTING API'S", () => {
    /* 
            Test API to create new factory.
    */
    describe('POST /createFactory', () => {
        it('OK, creating new factory works', (done) => {
            request(app).post('/createFactory')
                .send({ name: 'TEST', minRange: 1000, maxRange: 1010, childrenCount: 2 })
                .then((res) => {
                    const body = res.body;
                    res.status.should.be.equal(201)
                    expect(body).to.contain.property('success');
                    body.success.should.be.eql(true);
                    done();
                })
                .catch((err) => done(err));
        });
    })
    /* 
            Test API to fetching list of factories.
    */
    describe('GET /getFactories', () => {
        it('OK, fetching list of factories works', (done) => {
            request(app).get('/getFactories')
                .then((res) => {
                    const body = res.body;
                    res.status.should.be.equal(200)
                    expect(body).to.contain.property('data');
                    done();
                })
                .catch((err) => done(err));

        });
    })

    describe('PUT /updateFactory', () => {
        /* 
                Test API to update factory.
        */
        it('OK, update factory works', (done) => {
            request(app).put('/updateFactory/TEST')
                .send({ name: 'TEST', minRange: 800, maxRange: 900, childrenCount: 3 })
                .then((res) => {
                    const body = res.body;
                    res.status.should.be.equal(200)
                    expect(body).to.contain.property('success');
                    body.success.should.be.eql(true);
                    done();
                })
                .catch((err) => done(err));

        });
    })
    /* 
            Test API to delete factory.
    */
    describe('DELETE /deleteFactory', () => {
        it('OK, delete factory works', (done) => {
            request(app).delete('/deleteFactory/TEST')
                .then((res) => {
                    const body = res.body;
                    res.status.should.be.equal(200)
                    expect(body).to.contain.property('success');
                    body.success.should.be.eql(true);
                    done();
                })
                .catch((err) => done(err));

        });
    })
})