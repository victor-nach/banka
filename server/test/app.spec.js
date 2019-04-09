import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

describe('root endpoint', () => {
  it('should return 200 with message', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should return 404', (done) => {
    chai
      .request(app)
      .get('/other')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});

describe('versioned endpoint', () => {
  it('should return 200 with message', (done) => {
    chai
      .request(app)
      .get('/api/v1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
