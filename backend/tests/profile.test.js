const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const fs = require('fs');

chai.use(chaiHttp);
chai.should();

let token;

describe('Profile API', () => {
  before((done) => {
    chai.request(server)
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin' })
      .end((err, res) => {
        res.should.have.status(200);
        token = res.body.token;
        done();
      });
  });

  after(() => {
    server.close();
  });

  describe('GET /profile', () => {
    it('should return user profile information', (done) => {
      chai.request(server)
        .get('/profile')
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('username');
          res.body.should.have.property('email');
          res.body.should.have.property('address');
          res.body.should.have.property('phone');
          res.body.should.have.property('balance');
          done();
        });
    });

    it('should not return profile information without a token', (done) => {
      chai.request(server)
        .get('/profile')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Token não fornecido');
          done();
        });
    });
  });
});
