import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import accountModel from '../models/accountModel';
import app from '../app';
import './transaction.spec';

chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;

const endPoint = '/api/v1/';

let userToken;
let staffToken;
let adminToken;
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidHlwZSI6ImNsaWVudCIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE1NTQ5NDg0NzZ9.LRxxMH6TWXP_JaiaXYHyrOR_ApRDUlnfCJIwds4LC_';

let userAccountNumber;
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

// standard error response
const assertError = (path, errorCode, user, done, keyString, token) => chai
  .request(app)
  .post(`${endPoint}${path}`)
  .set('x-access-token', token)
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

// standard error response with request parameter
const assertErrorParams = (errorCode, status, number, done, keyString, token) => chai
  .request(app)
  .patch(`${endPoint}accounts/${number}`)
  .set('x-access-token', token)
  .send({ status })
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

const assertErrorParamsD = (errorCode, number, done, keyString, token) => chai
  .request(app)
  .delete(`${endPoint}accounts/${number}`)
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

const assertErrorAllAccounts = (errorCode, email, done, keyString, token) => chai
  .request(app)
  .get(`${endPoint}user/${email}/accounts`)
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

const assertErrorAccount = (errorCode, accountNumber, done, keyString, token) => chai
  .request(app)
  .get(`${endPoint}accounts/${accountNumber}`)
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

before('get user token', (done) => {
  chai.request(app)
    .post(`${endPoint}/auth/signin`)
    .send(userData)
    .end((err, res) => {
      userToken = res.body.data.token;
      done();
    });
});

before('get staff token', (done) => {
  chai.request(app)
    .post(`${endPoint}/auth/signin`)
    .send(staffData)
    .end((err, res) => {
      staffToken = res.body.data.token;
      done();
    });
});
before('get staff token', (done) => {
  chai.request(app)
    .post(`${endPoint}/auth/signin`)
    .send(adminData)
    .end((err, res) => {
      adminToken = res.body.data.token;
      done();
    });
});
before('get staff token', (done) => {
  chai.request(app)
    .post(`${endPoint}/auth/signin`)
    .send(adminData)
    .end((err, res) => {
      adminToken = res.body.data.token;
      done();
    });
});

describe('POST /accounts', () => {
  describe('User can create bank account', () => {
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
          expect(res.body.data.type).to.be.a('string');
          expect(res.body.data).to.have.property('openingBalance');
          userAccountNumber = res.body.data.accountNumber;
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

    // it('should return 500 for a server error', (done) => {
    //   const createAccount = sinon.stub(accountModel, 'createAccount');
    //   createAccount.throws();

    //   const account = {
    //     type: 'savings',
    //     openingBalance: 1000,
    //   };
    //   assertError('accounts', 500, account, done, 'server', userToken);
    // });
  });
});

// PATCH /acounts/<account-number> Staff can change bank account status
describe('PATCH /accounts/<account-number>', () => {
  describe('Staff can change bank account status', () => {
    it('Should return 200 and change bank account status', (done) => {
      const status = { status: 'active' };
      chai
        .request(app)
        .patch(`${endPoint}accounts/${userAccountNumber}`)
        .set('x-access-token', adminToken)
        .send(status)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.a('object');
          expect(res.body.data).to.have.property('accountNumber');
          expect(res.body.data.accountNumber).to.be.a('number');
          expect(res.body.data).to.have.property('status');
          expect(res.body.data.status).to.be.a('string');
          done();
        });
    });

    // check account status validations
    it('should return 400 if account status is omitted', (done) => {
      assertErrorParams(400, '', userAccountNumber, done, 'kindly put in', adminToken);
    });

    it('should return 400 if account type is neither active nor dormant', (done) => {
      assertErrorParams(400, 'dorm', userAccountNumber, done, 'dormant', adminToken);
    });

    // check account opening balance validations
    it('should return 404 if account number is omitted', (done) => {
      const status = { status: 'active' };
      chai
        .request(app)
        .patch(`${endPoint}accounts`)
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
      assertErrorParams(400, 'active', '13213dd', done, 'valid number', adminToken);
    });

    it('should return 400 if account number is not up to 10 digits', (done) => {
      assertErrorParams(400, 'active', 123456789, done, 'less than 10', adminToken);
    });

    it('should return 400 if account number is more than 10 digits', (done) => {
      assertErrorParams(400, 'active', 12345678912, done, 'maximum of 10', adminToken);
    });

    it('should return 404 if account number doesn\'t match any accounts', (done) => {
      assertErrorParams(404, 'active', 1234567891, done, 'no matches', adminToken);
    });

    // token errors
    it('should return 400 if authentication token is missing', (done) => {
      const status = { status: 'dormant' };
      chai
        .request(app)
        .patch(`${endPoint}/accounts/${userAccountNumber}`)
        .send(status)
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
      assertErrorParams(400, 'active', userAccountNumber, done, 'invalid', invalidToken);
    });

    it('should return 401 if user token is provided (unauthorized access)', (done) => {
      assertErrorParams(401, 'active', userAccountNumber, done, 'client', userToken);
    });

    it('should return 401 if staff token is provided (unauthorized access)', (done) => {
      assertErrorParams(401, 'active', userAccountNumber, done, 'staff', staffToken);
    });

    it('should return 500 for a server error', (done) => {
    // tell the user model function for creating an account to throw an error regardless
      sinon.stub(accountModel, 'editAccount').throws();

      assertErrorParams(500, 'active', userAccountNumber, done, 'server', adminToken);
    });
  });
});

const deleteAccount = sinon.stub(accountModel, 'deleteAccount');
// DELETE /acounts/<account-number> Admin can delete bank account
describe('DELETE /accounts/<account-number>', () => {
  describe('Admin can delete bank account', () => {
    after(() => {
      deleteAccount.restore();
    });
    it('should return 500 for a server error', (done) => {
      deleteAccount.throws();
      assertErrorParamsD(500, userAccountNumber, done, 'server', adminToken);
    });
    it('should return 200 and delete a bank account', (done) => {
      deleteAccount.restore();
      chai
        .request(app)
        .delete(`${endPoint}accounts/1234567805`)
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.include('deleted');
          done();
        });
    });

    it('should return 404 if the account has just been deleted account', (done) => {
      chai
        .request(app)
        .delete(`${endPoint}accounts/1234567805`)
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });

    // check account number validations
    it('should return 404 if account number is omitted', (done) => {
      chai
        .request(app)
        .delete(`${endPoint}accounts`)
        .set('x-access-token', adminToken)
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
      assertErrorParamsD(400, '13213dd', done, 'valid number', adminToken);
    });

    it('should return 400 if account number is not up to 10 digits', (done) => {
      assertErrorParamsD(400, 123456789, done, 'less than 10', adminToken);
    });

    it('should return 400 if account number is more than 10 digits', (done) => {
      assertErrorParamsD(400, 12345678912, done, 'maximum of 10', adminToken);
    });

    it('should return 404 if account number doesn\'t match any accounts', (done) => {
      assertErrorParamsD(404, 1234567891, done, 'no matches', adminToken);
    });

    // token errors
    it('should return 400 if authentication token is missing', (done) => {
      chai
        .request(app)
        .delete(`${endPoint}/accounts/${userAccountNumber}`)
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
      assertErrorParamsD(400, userAccountNumber, done, 'invalid', invalidToken);
    });

    it('should return 401 if user token is provided (unauthorized access)', (done) => {
      assertErrorParamsD(401, userAccountNumber, done, 'client', userToken);
    });

    it('should return 401 if staff token is provided (unauthorized access)', (done) => {
      assertErrorParamsD(401, userAccountNumber, done, 'staff', staffToken);
    });

    it('should return 404 for a an account if it has been sucessfully deleted', (done) => {
      const throws = sinon.stub(accountModel, 'deleteAccount');
      throws.throws('account_null');
      assertErrorParamsD(404, userAccountNumber, done, 'no matches found', adminToken);
    });
  });
});

// GET /user/<email-address>/accounts Admin can view all user's bank account
describe('GET /user/<email-address>/accounts', () => {
  describe('Admin can view all user\'s bank account', () => {
    it('Should return 200 and all user\'s bank accounts', (done) => {
      chai
        .request(app)
        .get(`${endPoint}user/${userData.email}/accounts`)
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.a('array');
          expect(res.body.data[0]).to.have.property('id');
          expect(res.body.data[0].id).to.be.a('number');
          expect(res.body.data[0]).to.have.property('accountNumber');
          // expect(res.body.data[0].accountNumber).to.be.a('number');
          expect(res.body.data[0]).to.have.property('createdOn');
          expect(res.body.data[0].createdOn).to.be.a('string');
          expect(res.body.data[0]).to.have.property('owner');
          // expect(res.body.data[0].owner).to.be.a('number');
          expect(res.body.data[0]).to.have.property('type');
          expect(res.body.data[0].type).to.be.a('string');
          expect(res.body.data[0]).to.have.property('status');
          expect(res.body.data[0].status).to.be.a('string');
          expect(res.body.data[0]).to.have.property('balance');
          // expect(res.body.data[0].balance).to.be.a('number');
          done();
        });
    });

    // check email validations
    it('should return 400 if email address is not valid', (done) => {
      assertErrorAllAccounts(400, 'ada@a', done, 'put in a valid email', adminToken);
    });

    it('should return 404 if email address is omitted', (done) => {
      chai
        .request(app)
        .get(`${endPoint}user/accounts`)
        .set('x-access-token', adminToken)
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

    it('should return 404 if email address doesn\'t match any users', (done) => {
      assertErrorAllAccounts(404, 'ada@a.com', done, 'no users found', adminToken);
    });

    it('should return 200 if email address doesn\'t have any bank account', (done) => {
      chai
        .request(app)
        .get(`${endPoint}user/johndoe@gmail.com/accounts`)
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

    // token errors
    it('should return 400 if authentication token is missing', (done) => {
      const status = { status: 'dormant' };
      chai
        .request(app)
        .get(`${endPoint}user/${userData.email}/accounts`)
        .send(status)
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
      assertErrorAllAccounts(400, userData.email, done, 'invalid', invalidToken);
    });

    it('should return 401 if user doesn\'t own the account', (done) => {
      assertErrorAllAccounts(401, 'cecewilliams@gmail.com', done, 'client', userToken);
    });

    it('should return 401 if staff doesn\'t own the account', (done) => {
      assertErrorAllAccounts(401, userData.email, done, 'staff', staffToken);
    });

    it('should return 500 for a server error', (done) => {
    // tell the user model function for creating an account to throw an error regardless
      sinon.stub(accountModel, 'allUserAccounts').throws();

      assertErrorAllAccounts(500, userData.email, done, 'Server Error', adminToken);
    });
  });
});

// GET /accounts/:account-number Admin can view single user's bank account
describe('GET /accounts/:account-number', () => {
  describe('Admin can view all a single bank account', () => {
    it('Should return 200 and bank account details', (done) => {
      chai
        .request(app)
        .get(`${endPoint}accounts/${userAccountNumber}`)
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.a('object');
          expect(res.body.data).to.have.property('id');
          expect(res.body.data.id).to.be.a('number');
          expect(res.body.data).to.have.property('accountNumber');
          // expect(res.body.data.accountNumber).to.be.a('number');
          expect(res.body.data).to.have.property('createdOn');
          expect(res.body.data.createdOn).to.be.a('string');
          expect(res.body.data).to.have.property('owner');
          // expect(res.body.data.owner).to.be.a('number');
          expect(res.body.data).to.have.property('type');
          expect(res.body.data.type).to.be.a('string');
          expect(res.body.data).to.have.property('status');
          expect(res.body.data.status).to.be.a('string');
          expect(res.body.data).to.have.property('balance');
          // expect(res.body.data.balance).to.be.a('number');
          done();
        });
    });

    // check email account number validations
    it('should return 400 if account number is not a number', (done) => {
      assertErrorAccount(400, '13213dd', done, 'valid number', adminToken);
    });

    it('should return 400 if account number is not up to 10 digits', (done) => {
      assertErrorAccount(400, 123456789, done, 'less than 10', adminToken);
    });

    it('should return 400 if account number is more than 10 digits', (done) => {
      assertErrorAccount(400, 12345678912, done, 'maximum of 10', adminToken);
    });

    it('should return 404 if account number doesn\'t match any accounts', (done) => {
      assertErrorAccount(404, 1234567891, done, 'doesn\'t match any accounts', adminToken);
    });

    // token errors
    it('should return 400 if authentication token is missing', (done) => {
      chai
        .request(app)
        .get(`${endPoint}accounts/${userAccountNumber}`)
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
      assertErrorAccount(400, userAccountNumber, done, 'invalid', invalidToken);
    });

    it('should return 401 if user doesn\'t own the account', (done) => {
      assertErrorAccount(401, 1234567803, done, 'client', userToken);
    });

    it('should return 401 if staff doesn\'t own the account', (done) => {
      assertErrorAccount(401, 1234567803, done, 'staff', staffToken);
    });

    it('should return 500 for a server error', (done) => {
    // tell the user model function for creating an account to throw an error regardless
      sinon.stub(accountModel, 'singleBankAccount').throws();

      assertErrorAccount(500, userAccountNumber, done, 'Server Error', adminToken);
    });
  });
});

// GET /accounts?status=active|dormant|draft Admin can view all bank account
describe('GET /accounts?status=active|dormant|draft', () => {
  describe('Admin can view all bank accounts', () => {
    it('Should return 200 and all bank accounts when no params are passed', (done) => {
      chai
        .request(app)
        .get(`${endPoint}/accounts`)
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.a('array');
          expect(res.body.data[0]).to.have.property('id');
          expect(res.body.data[0].id).to.be.a('number');
          expect(res.body.data[0]).to.have.property('accountNumber');
          // expect(res.body.data[0].accountNumber).to.be.a('number');
          expect(res.body.data[0]).to.have.property('createdOn');
          expect(res.body.data[0].createdOn).to.be.a('string');
          expect(res.body.data[0]).to.have.property('owner');
          // expect(res.body.data[0].owner).to.be.a('number');
          expect(res.body.data[0]).to.have.property('type');
          expect(res.body.data[0].type).to.be.a('string');
          expect(res.body.data[0]).to.have.property('status');
          expect(res.body.data[0].status).to.be.a('string');
          expect(res.body.data[0]).to.have.property('balance');
          // expect(res.body.data[0].balance).to.be.a('number');
          done();
        });
    });

    it('Should return 200 and all draft accounts', (done) => {
      chai
        .request(app)
        .get(`${endPoint}/accounts?status=draft`)
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.a('array');
          expect(res.body.data[0]).to.have.property('id');
          expect(res.body.data[0].id).to.be.a('number');
          expect(res.body.data[0]).to.have.property('accountNumber');
          // expect(res.body.data[0].accountNumber).to.be.a('number');
          expect(res.body.data[0]).to.have.property('createdOn');
          expect(res.body.data[0].createdOn).to.be.a('string');
          expect(res.body.data[0]).to.have.property('owner');
          // expect(res.body.data[0].owner).to.be.a('number');
          expect(res.body.data[0]).to.have.property('type');
          expect(res.body.data[0].type).to.be.a('string');
          expect(res.body.data[0]).to.have.property('status');
          expect(res.body.data[0].status).to.be.a('string');
          expect(res.body.data[0]).to.have.property('balance');
          // expect(res.body.data[0].balance).to.be.a('number');
          done();
        });
    });

    it('Should return 200 and all active accounts', (done) => {
      chai
        .request(app)
        .get(`${endPoint}/accounts?status=active`)
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.a('array');
          expect(res.body.data[0]).to.have.property('id');
          expect(res.body.data[0].id).to.be.a('number');
          expect(res.body.data[0]).to.have.property('accountNumber');
          // expect(res.body.data[0].accountNumber).to.be.a('number');
          expect(res.body.data[0]).to.have.property('createdOn');
          expect(res.body.data[0].createdOn).to.be.a('string');
          expect(res.body.data[0]).to.have.property('owner');
          // expect(res.body.data[0].owner).to.be.a('number');
          expect(res.body.data[0]).to.have.property('type');
          expect(res.body.data[0].type).to.be.a('string');
          expect(res.body.data[0]).to.have.property('status');
          expect(res.body.data[0].status).to.be.a('string');
          expect(res.body.data[0]).to.have.property('balance');
          // expect(res.body.data[0].balance).to.be.a('number');
          done();
        });
    });

    it('Should return 200 and all dormant accounts', (done) => {
      chai
        .request(app)
        .get(`${endPoint}/accounts?status=dormant`)
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.a('array');
          expect(res.body.data[0]).to.have.property('id');
          expect(res.body.data[0].id).to.be.a('number');
          expect(res.body.data[0]).to.have.property('accountNumber');
          // expect(res.body.data[0].accountNumber).to.be.a('number');
          expect(res.body.data[0]).to.have.property('createdOn');
          expect(res.body.data[0].createdOn).to.be.a('string');
          expect(res.body.data[0]).to.have.property('owner');
          // expect(res.body.data[0].owner).to.be.a('number');
          expect(res.body.data[0]).to.have.property('type');
          expect(res.body.data[0].type).to.be.a('string');
          expect(res.body.data[0]).to.have.property('status');
          expect(res.body.data[0].status).to.be.a('string');
          expect(res.body.data[0]).to.have.property('balance');
          // expect(res.body.data[0].balance).to.be.a('number');
          done();
        });
    });

    it('should return 400 if account status is invalid', (done) => {
      chai
        .request(app)
        .get(`${endPoint}accounts?status=walker`)
        .set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.be.include(' either dormant, active or draft');
          done();
        });
    });

    // token errors
    it('should return 400 if authentication token is missing', (done) => {
      chai
        .request(app)
        .get(`${endPoint}accounts`)
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
      chai
        .request(app)
        .get(`${endPoint}accounts`)
        .set('x-access-token', invalidToken)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.include('invalid');
          done();
        });
    });

    it('should return 401 if user authentication token is provided', (done) => {
      chai
        .request(app)
        .get(`${endPoint}accounts`)
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(401);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.include('client');
          done();
        });
    });

    it('should return 401 if staff authentication token is provided', (done) => {
      chai
        .request(app)
        .get(`${endPoint}accounts`)
        .set('x-access-token', staffToken)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal(401);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.include('staff');
          done();
        });
    });

    // it('should return 500 for a server error', (done) => {
    //   // sinon.stub(accountModel, 'allBankAccounts').throws();
    //   chai
    //     .request(app)
    //     .get(`${endPoint}accounts`)
    //     .set('x-access-token', adminToken)
    //     .end((err, res) => {
    //       expect(res).to.have.status(500);
    //       expect(res.body).to.be.a('object');
    //       expect(res.body).to.have.property('status');
    //       expect(res.body.status).to.be.equal(500);
    //       expect(res.body).to.have.property('error');
    //       expect(res.body.error).to.be.a('string');
    //       done();
    //     });
    // });
  });
});

describe('delete all accounts and test for case when accounts is empty', () => {
  it('user should return the default account number', (done) => {
    chai
      .request(app)
      .delete(`${endPoint}accounts/1234567801`)
      .set('x-access-token', adminToken)
      .end(() => {
        chai
          .request(app)
          .delete(`${endPoint}accounts/1234567802`)
          .set('x-access-token', adminToken)
          .end(() => {
            chai
              .request(app)
              .delete(`${endPoint}accounts/1234567803`)
              .set('x-access-token', adminToken)
              .end(() => {
                chai
                  .request(app)
                  .delete(`${endPoint}accounts/1234567804`)
                  .set('x-access-token', adminToken)
                  .end(() => {
                    chai
                      .request(app)
                      .delete(`${endPoint}accounts/1234567805`)
                      .set('x-access-token', adminToken)
                      .end(() => {
                        chai
                          .request(app)
                          .delete(`${endPoint}accounts/1234567806`)
                          .set('x-access-token', adminToken)
                          .end(() => {
                            chai
                              .request(app)
                              .delete(`${endPoint}accounts/1234567807`)
                              .set('x-access-token', adminToken)
                              .end(() => {
                                chai
                                  .request(app)
                                  .delete(`${endPoint}accounts/1234567808`)
                                  .set('x-access-token', adminToken)
                                  .end(() => {
                                    done();
                                  });
                              });
                          });
                      });
                  });
              });
          });
      });
  });

  it('should return 200 if there are no bank accounts', (done) => {
    chai
      .request(app)
      .get(`${endPoint}accounts`)
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

  it('should return 200 if there are no draft bank accounts', (done) => {
    chai
      .request(app)
      .get(`${endPoint}accounts?status=active`)
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

  it('should return 200 if there are no dormant bank accounts', (done) => {
    chai
      .request(app)
      .get(`${endPoint}accounts?status=dormant`)
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

  it('should return 200 if there are no active bank accounts', (done) => {
    chai
      .request(app)
      .get(`${endPoint}accounts?status=draft`)
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
        expect(res.body.data.type).to.be.a('string');
        expect(res.body.data).to.have.property('openingBalance');
        done();
      });
  });
});
