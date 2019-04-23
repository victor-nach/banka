import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import transactionModel from '../models/transactionModel';
import app from '../app';

chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;

const endPoint = '/api/v1/';

let userToken;
let staffToken;
let adminToken;
let userAccountNumber;
const transactionId = 2;
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidHlwZSI6ImNsaWVudCIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE1NTQ5NDg0NzZ9.LRxxMH6TWXP_JaiaXYHyrOR_ApRDUlnfCJIwds4LC_';


const userData = {
  email: 'mesutnyemaka@gmail.com',
  password: 'wenger',
};
const staffData = {
  email: 'arjenofukwu@gmail.com',
  password: 'flyingdutch',
};
const adminData = {
  email: 'chrisewu@gmail.com',
  password: 'chrisewu',
};

before('get staff, user token and user account number', (done) => {
  const account = {
    type: 'savings',
    openingBalance: 500000,
  };
  const status = { status: 'active' };
  chai.request(app)
    .post(`${endPoint}/auth/signin`)
    .send(staffData)
    .end((err, res) => {
      staffToken = res.body.data.token;
      chai.request(app)
        .post(`${endPoint}/auth/signin`)
        .send(adminData)
        .end((err, res) => {
          adminToken = res.body.data.token;
          chai.request(app)
            .post(`${endPoint}/auth/signin`)
            .send(userData)
            .end((err, res) => {
              userToken = res.body.data.token;
              chai
                .request(app)
                .post(`${endPoint}/accounts`)
                .set('x-access-token', userToken)
                .send(account)
                .end((err, res) => {
                  userAccountNumber = res.body.accountNumber;
                  chai // get user account number
                    .request(app)
                    .post(`${endPoint}/accounts`)
                    .set('x-access-token', userToken)
                    .send(account)
                    .end((err, res) => {
                      userAccountNumber = res.body.data.accountNumber;
                      chai // activate user account number
                        .request(app)
                        .patch(`${endPoint}accounts/${userAccountNumber}`)
                        .set('x-access-token', adminToken)
                        .send(status)
                        .end(() => {
                          done();
                        });
                      // done();
                    });
                });
            });
        });
    });
});

const assertError = (errorCode, amount, done, keyString, token, type) => chai
  .request(app)
  .post(`${endPoint}transactions/${userAccountNumber}/${type}`)
  .set('x-access-token', token)
  .send(amount)
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

// standard error response with request parameter
const assertErrorParams = (errorCode, amount, number, done, keyString, token, type) => chai
  .request(app)
  .post(`${endPoint}transactions/${number}/${type}`)
  .set('x-access-token', token)
  .send({ amount })
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

const assertErrorGetTrans = (errorCode, userAccountNumber, done, keyString, token) => chai
  .request(app)
  .get(`${endPoint}accounts/${userAccountNumber}/transactions`)
  .set('x-access-token', token)
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

const assertErrorSingleTrans = (errorCode, transactionId, done, keyString, token) => chai
  .request(app)
  .get(`${endPoint}transactions/${transactionId}`)
  .set('x-access-token', token)
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

describe('POST /transactions/<accout-number>/debit', () => {
  describe('Staff can debit bank account', () => {
    it('staff should be able to debit bank account', (done) => {
      const amount = {
        amount: 12300.12,
      };
      chai
        .request(app)
        .post(`${endPoint}transactions/${userAccountNumber}/debit`)
        // .post(`${endPoint}transactions/1234567804/debit`)
        .set('x-access-token', staffToken)
        .send(amount)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.a('object');
          expect(res.body.data).to.have.property('accountNumber');
          expect(res.body.data.accountNumber).to.be.a('number');
          expect(res.body.data).to.have.property('transactionId');
          expect(res.body.data.transactionId).to.be.a('number');
          expect(res.body.data).to.have.property('amount');
          expect(res.body.data.amount).to.be.a('number');
          expect(res.body.data).to.have.property('cashier');
          expect(res.body.data.cashier).to.be.a('number');
          expect(res.body.data).to.have.property('transactionType');
          expect(res.body.data.transactionType).to.be.a('string');
          expect(res.body.data).to.have.property('accountBalance');
          expect(res.body.data.accountBalance).to.be.a('string');
          done();
        });
    });

    // amount validations
    it('should return 400 if amount is omitted', (done) => {
      const amount = {
        amount: '',
      };
      assertError(400, amount, done, 'kindly put in', staffToken, 'debit');
    });

    it('should return 400 if amount is not a number', (done) => {
      const amount = {
        amount: '2132311a',
      };
      assertError(400, amount, done, 'valid', staffToken, 'debit');
    });

    it('should return 400 for insufficient funds', (done) => {
      const amount = {
        amount: 900000,
      };
      assertError(400, amount, done, 'Insufficient', staffToken, 'debit');
    });

    // account number validations
    it('should return 404 if account number is omitted', (done) => {
      const status = { status: 'active' };
      chai
        .request(app)
        .post(`${endPoint}transactions/debit`)
        .set('x-access-token', adminToken)
        .send(status)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.be.include('not exist');
          done();
        });
    });

    it('should return 400 if account number is not a number', (done) => {
      assertErrorParams(400, 12000, '13213dd', done, 'valid number', staffToken, 'debit');
    });

    it('should return 400 if account number is not up to 10 digits', (done) => {
      assertErrorParams(400, 12000, 123456789, done, 'less than 10', staffToken, 'debit');
    });

    it('should return 400 if account number is more than 10 digits', (done) => {
      assertErrorParams(400, 12000, 12345678912, done, 'maximum of 10', staffToken, 'debit');
    });

    it('should return 404 if account number doesn\'t match any accounts', (done) => {
      assertErrorParams(404, 12000, 1234567891, done, 'doesn\'t exist', staffToken, 'debit');
    });

    it('should return 400 if account is in draft phase', (done) => {
      assertErrorParams(400, 12000, 1234567801, done, 'draft', staffToken, 'debit');
    });

    it('should return 400 if account is dormant', (done) => {
      assertErrorParams(400, 12000, 1234567803, done, 'dormant', staffToken, 'debit');
    });


    // token errors
    it('should return 400 if authentication token is missing', (done) => {
      const amount = { amount: 1500 };
      chai
        .request(app)
        .post(`${endPoint}transactions/${userAccountNumber}/debit`)
        .send(amount)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.include('missing');
          done();
        });
    });

    it('should return 400 if authentication token is invalid', (done) => {
      assertErrorParams(400, 12000, userAccountNumber, done, 'invalid', invalidToken, 'debit');
    });

    it('should return 401 if user token is provided (unauthorized access)', (done) => {
      assertErrorParams(401, 12000, userAccountNumber, done, 'client', userToken, 'debit');
    });
  });
});

// Staffs should be able to credit a bank account
describe('POST /transactions/<accout-number>/credit', () => {
  describe('Staff can credit bank account', () => {
    it('should return 200 and credit bank account', (done) => {
      const amount = {
        amount: 12300.12,
      };
      chai
        .request(app)
        .post(`${endPoint}transactions/${userAccountNumber}/credit`)
        // .post(`${endPoint}transactions/1234567804/credit`)
        .set('x-access-token', staffToken)
        .send(amount)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.a('object');
          expect(res.body.data).to.have.property('accountNumber');
          expect(res.body.data.accountNumber).to.be.a('number');
          expect(res.body.data).to.have.property('transactionId');
          expect(res.body.data.transactionId).to.be.a('number');
          expect(res.body.data).to.have.property('amount');
          expect(res.body.data.amount).to.be.a('number');
          expect(res.body.data).to.have.property('cashier');
          expect(res.body.data.cashier).to.be.a('number');
          expect(res.body.data).to.have.property('transactionType');
          expect(res.body.data.transactionType).to.be.a('string');
          expect(res.body.data).to.have.property('accountBalance');
          expect(res.body.data.accountBalance).to.be.a('string');
          done();
        });
    });

    // amount validations
    it('should return 400 if amount is omitted', (done) => {
      const amount = {
        amount: '',
      };
      assertError(400, amount, done, 'kindly put in', staffToken, 'credit');
    });

    it('should return 400 if amount is not a number', (done) => {
      const amount = {
        amount: '2132311a',
      };
      assertError(400, amount, done, 'valid', staffToken, 'credit');
    });

    // account number validations
    it('should return 404 if account number is omitted', (done) => {
      const status = { status: 'active' };
      chai
        .request(app)
        .post(`${endPoint}transactions/credit`)
        .set('x-access-token', adminToken)
        .send(status)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.be.include('not exist');
          done();
        });
    });

    it('should return 400 if account number is not a number', (done) => {
      assertErrorParams(400, 12000, '13213dd', done, 'valid number', staffToken, 'credit');
    });

    it('should return 400 if account number is not up to 10 digits', (done) => {
      assertErrorParams(400, 12000, 123456789, done, 'less than 10', staffToken, 'credit');
    });

    it('should return 400 if account number is more than 10 digits', (done) => {
      assertErrorParams(400, 12000, 12345678912, done, 'maximum of 10', staffToken, 'credit');
    });

    it('should return 404 if account number doesn\'t match any accounts', (done) => {
      assertErrorParams(404, 12000, 1234567891, done, 'doesn\'t exist', staffToken, 'credit');
    });

    it('should return 400 if account is in draft phase', (done) => {
      assertErrorParams(400, 12000, 1234567801, done, 'draft', staffToken, 'credit');
    });

    it('should return 400 if account is dormant', (done) => {
      assertErrorParams(400, 12000, 1234567803, done, 'dormant', staffToken, 'credit');
    });


    // token errors
    it('should return 400 if authentication token is missing', (done) => {
      const amount = { amount: 1500 };
      chai
        .request(app)
        .post(`${endPoint}transactions/${userAccountNumber}/credit`)
        .send(amount)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.include('missing');
          done();
        });
    });

    it('should return 400 if authentication token is invalid', (done) => {
      assertErrorParams(400, 12000, userAccountNumber, done, 'invalid', invalidToken, 'credit');
    });

    it('should return 401 if user token is provided (unauthorized access)', (done) => {
      assertErrorParams(401, 12000, userAccountNumber, done, 'client', userToken, 'credit');
    });

    it('should return 500 for a server error debiting an account', (done) => {
    // tell the user model function for creating an account to throw an error regardless
      sinon.stub(transactionModel, 'transactions').throws();

      assertErrorParams(500, 12000, userAccountNumber, done, 'server', adminToken, 'debit');
    });

    it('should return 500 for a server error whenn crediting an account', (done) => {
    // tell the user model function for creating an account to throw an error regardless
    // sinon.stub(transactionModel, 'transactions').throws();

      assertErrorParams(500, 12000, userAccountNumber, done, 'server', adminToken, 'credit');
    });
  });
});

// Users should be view all account transactions
describe('GET accounts/<accout-number>/transactions/', () => {
  describe('Users can view all account transactions', () => {
    userAccountNumber = 1234567804;
    it('should return 200 and all transaction details', (done) => {
      chai
        .request(app)
        .get(`${endPoint}accounts/${userAccountNumber}/transactions`)
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.a('array');
          expect(res.body.data[0]).to.have.property('id');
          expect(res.body.data[0].id).to.be.a('number');
          expect(res.body.data[0]).to.have.property('createdOn');
          expect(res.body.data[0].createdOn).to.be.a('string');
          expect(res.body.data[0]).to.have.property('type');
          expect(res.body.data[0].type).to.be.a('string');
          expect(res.body.data[0]).to.have.property('amount');
          // expect(res.body.data[0].amount).to.be.a('number');
          expect(res.body.data[0]).to.have.property('newBalance');
          // expect(res.body.data[0].newBalance).to.be.a('number');
          expect(res.body.data[0]).to.have.property('oldBalance');
          // expect(res.body.data[0].oldBalance).to.be.a('number');
          done();
        });
    });

    it('should return 200 and response message if account has no transactions yet', (done) => {
      chai
        .request(app)
        .get(`${endPoint}accounts/1234567803/transactions`)
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.a('string');
          done();
        });
    });

    // account number validations
    it('should return 404 if account number is omitted', (done) => {
      chai
        .request(app)
        .get(`${endPoint}accounts/transactions`)
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.be.include('not exist');
          done();
        });
    });

    it('should return 400 if account number is not a number', (done) => {
      assertErrorGetTrans(400, '12345678aa', done, 'valid number', userToken);
    });

    it('should return 400 if account number is not up to 10 digits', (done) => {
      assertErrorGetTrans(400, 123456789, done, 'less than 10', userToken);
    });

    it('should return 400 if account number is more than 10 digits', (done) => {
      assertErrorGetTrans(400, 12345678912, done, 'maximum of 10', userToken);
    });

    it('should return 404 if account number doesn\'t match any accounts', (done) => {
      assertErrorGetTrans(404, 1234567891, done, 'doesn\'t exist', adminToken);
    });

    it('should return 400 if account is in draft phase', (done) => {
      assertErrorGetTrans(400, 1234567801, done, 'draft', adminToken);
    });

    it('should return 401 if account doesn\'t belong to user', (done) => {
      assertErrorGetTrans(401, 1234567802, done, 'unauthorized access (client)', userToken);
    });

    // token errors
    it('should return 400 if authentication token is missing', (done) => {
      chai
        .request(app)
        .get(`${endPoint}accounts/${userAccountNumber}/transactions`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.include('missing');
          done();
        });
    });

    it('should return 400 if authentication token is invalid', (done) => {
      assertErrorGetTrans(400, userAccountNumber, done, 'invalid', invalidToken);
    });

    it('should return 500 for a server error getting all transactions', (done) => {
      // tell the user model function for creating an account to throw an error regardless
      sinon.stub(transactionModel, 'allTransactions').throws();

      assertErrorGetTrans(500, userAccountNumber, done, 'server', userToken);
    });
  });
});

// Users should be view single account transactions
describe('GET transactions/<transaction-id>', () => {
  describe('Users can view a specific account transactions', () => {
    it('should return 200 and all transaction details', (done) => {
      chai
        .request(app)
        .get(`${endPoint}transactions/${transactionId}`)
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.a('object');
          expect(res.body.data).to.have.property('id');
          expect(res.body.data.id).to.be.a('number');
          expect(res.body.data).to.have.property('createdOn');
          expect(res.body.data.createdOn).to.be.a('string');
          expect(res.body.data).to.have.property('type');
          expect(res.body.data.type).to.be.a('string');
          expect(res.body.data).to.have.property('amount');
          // expect(res.body.data.amount).to.be.a('number');
          expect(res.body.data).to.have.property('newBalance');
          // expect(res.body.data.newBalance).to.be.a('number');
          expect(res.body.data).to.have.property('oldBalance');
          // expect(res.body.data.oldBalance).to.be.a('number');
          done();
        });
    });

    // transaction id validations
    it('should return 404 if transaction id is omitted', (done) => {
      chai
        .request(app)
        .get(`${endPoint}transactions`)
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.be.include('not exist');
          done();
        });
    });

    it('should return 400 if transaction id is not a number', (done) => {
      assertErrorSingleTrans(400, '1a', done, 'valid number', userToken);
    });

    it('should return 404 if transactionId doesn\'t match any transactions', (done) => {
      assertErrorSingleTrans(404, 91, done, 'No transaction found', adminToken);
    });


    it('should return 401 if account doesn\'t belong to user', (done) => {
      assertErrorSingleTrans(401, 1, done, 'unauthorized access', userToken);
    });

    it('should return 401 if account doesn\'t belong to staff', (done) => {
      assertErrorSingleTrans(401, 1, done, 'unauthorized access', staffToken);
    });

    // token errors
    it('should return 400 if authentication token is missing', (done) => {
      chai
        .request(app)
        .get(`${endPoint}transactions/${transactionId}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.include('missing');
          done();
        });
    });

    it('should return 400 if authentication token is invalid', (done) => {
      assertErrorSingleTrans(400, transactionId, done, 'invalid', invalidToken);
    });

    it('should return 500 for a server error getting single transactions', (done) => {
      // tell the user model function to throw an error regardless
      sinon.stub(transactionModel, 'singleTransactions').throws();

      assertErrorSingleTrans(500, transactionId, done, 'server', userToken);
    });
  });
});
