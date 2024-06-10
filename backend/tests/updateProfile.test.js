const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const fs = require('fs');

chai.use(chaiHttp);
chai.should();

let token;

describe('Update Profile API', () => {
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

  describe('POST /updateProfile', () => {
    it('should update user profile information', (done) => {
      const updatedInfo = {
        username: 'admin',
        email: 'new_email@example.com',
        address: 'new_address',
        phone: '123456789'
      };

      chai.request(server)
        .post('/updateProfile')
        .set('Authorization', token)
        .send(updatedInfo)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          done();
        });
    });

    it('should not update profile information without a token', (done) => {
      chai.request(server)
        .post('/updateProfile')
        .send({
          username: 'admin',
          email: 'new_email@example.com',
          address: 'new_address',
          phone: '123456789'
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Token não fornecido');
          done();
        });
    });
  });
});
