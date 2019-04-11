import userModel from '../models/userModel';
import helper from '../utils/helper';

class userController {
  static async signup(req, res) {
    const {
      firstName, lastName, email, password,
    } = req.body;
    const hashedPassword = helper.hashPassword(password);
    try {
      const user = await userModel.signup(firstName, lastName, email, hashedPassword);
      const { id, type, isAdmin } = user;
      const token = await helper.generateToken({ id, type, isAdmin });
      res.status(201).json({
        status: 201,
        data: {
          token, id: user.id, firstName, lastName, email,
        },
      });
    } catch (error) {
      if (error.name === 'email_conflict') {
        res.status(409).json({
          status: 409,
          error: 'Kindly use another email, this email address has already been used',
        });
      } else {
        res.status(500).json({
          status: 500,
          error: 'Internal server error',
        });
      }
    }
  }

  static async signin(req, res) {
    const { email, password } = req.body;
    try {
      const {
        id, firstName, lastName, hashedPassword, type, isAdmin,
      } = await userModel.signin(email);
      const token = await helper.generateToken({ id, type, isAdmin });
      if (helper.comparePassword(password, hashedPassword) === true) {
        res.status(200).json({
          status: 200,
          data: {
            token, firstName, lastName, email,
          },
        });
      } else {
        res.status(403).json({
          status: 403,
          error: 'the password you have entered is invalid',
        });
      }
    } catch (error) {
      if (error.name === 'email_null') {
        res.status(404).json({
          status: 404,
          error: 'this email has been not been registered on this platform',
        });
      } else {
        res.status(500).json({
          status: 500,
          error: 'Internal server error',
        });
      }
    }
  }
}

export default userController;
