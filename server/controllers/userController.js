import users from '../models/userModel';
import helper from '../utils/helper';

class userController {
  static async signup(req, res) {
    const {
      firstName, lastName, email, password,
    } = req.body;
    const hashedPassword = helper.hashPassword(password);

    try {
      const user = await users.signup(firstName, lastName, email, hashedPassword);
      const token = await helper.generateToken(user.id, user.type, user.isAdmin);
      res.status(201).json({
        status: 201,
        data: {
          token,
          id: user.id,
          firstName,
          lastName,
          email,
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
}

export default userController;
