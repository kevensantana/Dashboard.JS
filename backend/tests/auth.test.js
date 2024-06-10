import chai from 'chai';
import chaiHttp from 'chai-http';
import { server } from '../server.js';  // Ajuste a importação conforme necessário

chai.use(chaiHttp);
const { should } = chai;

describe('Auth API', () => {
  after(() => {
    server.close();
  });

  describe('POST /auth/login', () => {
    it('should login a user and return a token', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({ username: 'admin', password: 'admin' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          done();
        });
    });

    it('should not login a user with invalid credentials', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({ username: 'admin', password: 'wrongpassword' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Credenciais inválidas');
          done();
        });
    });
  });
});
