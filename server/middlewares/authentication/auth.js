import helper from '../../utils/helper';

class Auth {
  static async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(400).json({
        status: 400,
        error: 'invalid request, token missing',
      });
    }
    try {
      const payload = await helper.decodeToken(token);
      req.user = {
        userId: payload.id,
        isAdmin: payload.isAdmin,
        userType: payload.type,
      };
      return next();
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: 'the token you have provided is invalid',
      });
    }
  }
}

export default Auth;
