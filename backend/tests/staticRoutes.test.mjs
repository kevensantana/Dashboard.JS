const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const path = require('path');
const fs = require('fs');

const should = chai.should();
chai.use(chaiHttp);

describe('Static Routes', () => {
  it('should get login.html', (done) => {
    chai.request(server)
      .get('/pages/login')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.html;
        done();
      });
  });

  it('should get login.js', (done) => {
    chai.request(server)
      .get('/scripts/login')
      .end((err, res) => {
        res.should.have.status(200);
        res.header['content-type'].should.include('application/javascript');
        done();
      });
  });

  it('should get login.css', (done) => {
    chai.request(server)
      .get('/styles/login')
      .end((err, res) => {
        res.should.have.status(200);
        res.header['content-type'].should.include('text/css');
        done();
      });
  });
});
