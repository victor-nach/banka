import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import userModel from '../models/userModel';
import app from '../app';

chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;

const endPoint = '/api/v1/auth';

// standard error response
const assertError = (path, errorCode, user, done) => chai
  .request(app)
  .post(`${endPoint}/${path}`)
  .send(user)
  .end((err, res) => {
    expect(res).to.have.status(errorCode);
    expect(res.body).to.be.a('object');
    expect(res.body).to.have.property('status');
    expect(res.body.status).to.be.equal(errorCode);
    expect(res.body).to.have.property('error');
    expect(res.body.error).to.be.a('string');
    done();
  });


describe('User sign Up', () => {
  it('should create a new user and return 201, and proper response body ', (done) => {
    const user = {
      firstName: 'adama',
      lastName: 'traore',
      email: 'adama@gmail.com',
      password: 'bellerin',
    };
    chai
      .request(app)
      .post(`${endPoint}/signup`)
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.be.equal(201);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.a('object');
        expect(res.body.data).to.have.property('token');
        expect(res.body.data.token).to.be.a('string');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data.id).to.be.a('number');
        expect(res.body.data.id % 1).to.be.equal(0);
        expect(res.body.data).to.have.property('firstName');
        expect(res.body.data.firstName).to.be.a('string');
        expect(res.body.data).to.have.property('lastName');
        expect(res.body.data.lastName).to.be.a('string');
        expect(res.body.data).to.have.property('email');
        expect(res.body.data.email).to.be.a('string');
        done();
      });
  });

  // check firstName validations
  it('should return 400 if first name is omitted', (done) => {
    const user = {
      lastName: 'traore',
      email: 'adama@gmail.com',
      password: 'bellerin',
    };
    assertError('signup', 400, user, done);
  });

  it('should return 400 if first name contains numbers', (done) => {
    const user = {
      firstName: 'alan1',
      lastName: 'traore',
      email: 'adama@gmail.com',
      password: 'bellerin',
    };
    assertError('signup', 400, user, done);
  });

  it('should return 400 if first name is less than 3 characters', (done) => {
    const user = {
      firstName: 'ib',
      lastName: 'traore',
      email: 'adama@gmail.com',
      password: 'bellerin',
    };
    assertError('signup', 400, user, done);
  });

  it('should return 400 if first name is more than 20 characters', (done) => {
    const user = {
      firstName: 'traorembadigweoneofohafia',
      lastName: 'alan',
      email: 'adama@gmail.com',
      password: 'bellerin',
    };
    assertError('signup', 400, user, done);
  });

  it('should return 400 if first name contains whitespace', (done) => {
    const user = {
      firstName: 'alan u',
      lastName: 'traore',
      email: 'adama@gmail.com',
      password: 'bellerin',
    };
    assertError('signup', 400, user, done);
  });

  // check lastName validations
  it('should return 400 if last name is omitted', (done) => {
    const user = {
      firstName: 'traore',
      email: 'adama@gmail.com',
      password: 'bellerin',
    };
    assertError('signup', 400, user, done);
  });

  it('should return 400 if last name contains numbers', (done) => {
    const user = {
      firstName: 'alan',
      lastName: 'traor1e',
      email: 'adama@gmail.com',
      password: 'bellerin',
    };
    assertError('signup', 400, user, done);
  });

  it('should return 400 if last name is less than 3 characters', (done) => {
    const user = {
      firstName: 'ibadan',
      lastName: 'ra',
      email: 'adamaboy@gmail.com',
      password: 'bellerin',
    };
    assertError('signup', 400, user, done);
  });

  it('should return 400 if last name is more than 20 characters', (done) => {
    const user = {
      firstName: 'alan',
      lastName: 'traorembadigweoneofohafia',
      email: 'adama@gmail.com',
      password: 'bellerin',
    };
    assertError('signup', 400, user, done);
  });

  it('should return 400 if last name contains whitespace', (done) => {
    const user = {
      firstName: 'alanu',
      lastName: 'trao fia',
      email: 'adama@gmail.com',
      password: 'bellerin',
    };
    assertError('signup', 400, user, done);
  });

  // check email address validations
  it('should return 400 if email address is omitted', (done) => {
    const user = {
      firstName: 'traore',
      lastName: 'adama',
      password: 'bellerin',
    };
    assertError('signup', 400, user, done);
  });

  it('should return 400 if email address contains whitespace', (done) => {
    const user = {
      firstName: 'alanu',
      lastName: 'traofia',
      email: 'ad ama@gmail.com',
      password: 'bellerin',
    };
    assertError('signup', 400, user, done);
  });

  it('should return 409 if email address already exists', (done) => {
    const user = {
      firstName: 'chris',
      lastName: 'ronaldo',
      email: 'chrisewu@gmail.com',
      password: 'Iamthegoat',
    };
    assertError('signup', 409, user, done);
  });

  it('should return 400 if password address is omitted', (done) => {
    const user = {
      firstName: 'traore',
      lastName: 'adama',
      email: 'adama@gmail.com',
    };
    assertError('signup', 400, user, done);
  });

  it('should return 500 for a server error', (done) => {
    // tell the user model function for creating a user to throw an error regardless
    sinon.stub(userModel, 'signup').throws();

    const user = {
      firstName: 'adama',
      lastName: 'traore',
      email: 'adamoa@gmail.com',
      password: 'bellerin',
    };
    assertError('signup', 500, user, done);
  });
});

describe('User sign in', () => {
  it('should sign in a new user and return 200, and proper response body ', (done) => {
    const user = {
      email: 'chrisewu@gmail.com',
      password: 'chrisewu',
    };
    chai
      .request(app)
      .post(`${endPoint}/signin`)
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.a('object');
        expect(res.body.data).to.have.property('token');
        expect(res.body.data.token).to.be.a('string');
        // expect(res.body.data).to.have.property('firstName');
        // expect(res.body.data.firstName).to.be.a('string');
        // expect(res.body.data).to.have.property('lastName');
        // expect(res.body.data.lastName).to.be.a('string');
        expect(res.body.data).to.have.property('email');
        expect(res.body.data.email).to.be.a('string');
        done();
      });
  });

  // check email address validations
  it('should return 400 if email address is omitted', (done) => {
    const user = {
      password: 'bellerin',
    };
    assertError('signin', 400, user, done);
  });

  it('should return 400 if email address contains whitespace', (done) => {
    const user = {
      email: 'ad ama@gmail.com',
      password: 'bellerin',
    };
    assertError('signin', 400, user, done);
  });

  it('should return 404 if email address does not match any email in the database', (done) => {
    const user = {
      email: 'christiewu@gmail.com',
      password: 'Iamthegoat',
    };
    assertError('signin', 404, user, done);
  });

  it('should return 400 if password is omitted', (done) => {
    const user = {
      email: 'adama@gmail.com',
    };
    assertError('signin', 400, user, done);
  });

  it('should return 403 if password is incorrect', (done) => {
    const user = {
      email: 'adama@gmail.com',
      password: 'tellmemore',
    };
    assertError('signin', 403, user, done);
  });

  it('should return 500 for a server error', (done) => {
    // tell the user model function for creating a user to throw an error regardless
    sinon.stub(userModel, 'signin').throws();

    const user = {
      email: 'chrisewu@gmail.com',
      password: 'chrisewu',
    };
    assertError('signin', 500, user, done);
  });
});
