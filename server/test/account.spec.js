import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import accountModel from '../models/accountModel';
import app from '../app';

chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;

const endPoint = '/api/v1/';

// standard error response
const assertError = (path, errorCode, user, done, keyString, userToken) => chai
  .request(app)
  .post(`${endPoint}${path}`)
  .set('x-access-token', userToken)
  .send(user)
  .end((err, res) => {
    expect(res).to.have.status(errorCode);
    expect(res.body).to.be.a('object');
    expect(res.body).to.have.property('status');
    expect(res.body.status).to.be.equal(errorCode);
    expect(res.body).to.have.property('error');
    expect(res.body.error).to.be.a('string');
    expect(res.body.error).to.include(keyString);
    done();
  });

let userToken;
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidHlwZSI6ImNsaWVudCIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE1NTQ5NDg0NzZ9.LRxxMH6TWXP_JaiaXYHyrOR_ApRDUlnfCJIwds4LC_';

const userData = {
  email: 'mesutnyemaka@gmail.com',
  password: 'wenger',
};

describe('User can create bannk account', () => {
  before((done) => {
    chai.request(app)
      .post(`${endPoint}/auth/signin`)
      .send(userData)
      .end((err, res) => {
        userToken = res.body.data.token;
        done();
      });
  });
  it('user should be able to create a new bank account', (done) => {
    const account = {
      type: 'savings',
      openingBalance: 10000,
    };
    chai
      .request(app)
      .post(`${endPoint}/accounts`)
      .set('x-access-token', userToken)
      .send(account)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.a('object');
        expect(res.body.data).to.have.property('accountNumber');
        expect(res.body.data.accountNumber).to.be.a('number');
        expect(res.body.data).to.have.property('firstName');
        expect(res.body.data.firstName).to.be.a('string');
        expect(res.body.data).to.have.property('lastName');
        expect(res.body.data.lastName).to.be.a('string');
        expect(res.body.data).to.have.property('email');
        expect(res.body.data.email).to.be.a('string');
        expect(res.body.data).to.have.property('type');
        // expect(res.body.data.id).to.be.a('string');
        expect(res.body.data).to.have.property('openingBalance');
        // expect(res.body.data.id).to.be.a('number');
        done();
      });
  });

  // check account type validations
  it('should return 400 if account type is omitted', (done) => {
    const account = {
      openingBalance: 10000,
    };
    assertError('accounts', 400, account, done, 'kindly put in', userToken);
  });

  it('should return 400 if account type is neither savings or current', (done) => {
    const account = {
      type: 'saver',
      openingBalance: 10000,
    };
    assertError('accounts', 400, account, done, 'savings', userToken);
  });

  // check account opening balance validations
  it('should return 400 if account opening balance is omitted', (done) => {
    const account = {
      type: 'savings',
    };
    assertError('accounts', 400, account, done, 'kindly put in', userToken);
  });

  it('should return 400 if openinng balance is not a floating point number', (done) => {
    const account = {
      type: 'savings',
      openingBalance: '1000a',
    };
    assertError('accounts', 400, account, done, 'valid number', userToken);
  });

  // token errors
  it('should return 400 if authentication token is missing', (done) => {
    const account = {
      type: 'savings',
      openingBalance: 1000,
    };
    chai
      .request(app)
      .post(`${endPoint}/accounts`)
      .send(account)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.be.equal(400);
        done();
      });
  });

  it('should return 400 if authentication token is invalid', (done) => {
    const account = {
      type: 'savings',
      openingBalance: 1000,
    };
    assertError('accounts', 400, account, done, 'invalid', invalidToken);
  });

  it('should return 500 for a server error', (done) => {
    // tell the user model function for creating an account to throw an error regardless
    sinon.stub(accountModel, 'createAccount').throws();

    const account = {
      type: 'savings',
      openingBalance: 1000,
    };
    assertError('accounts', 500, account, done, 'server', userToken);
  });
});
