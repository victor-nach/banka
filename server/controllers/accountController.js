import accountModel from '../models/accountModel';

class AccountController {
  static async createAccount(req, res) {
    const { type, openingBalance } = req.body;
    const openingBalanceF = parseFloat(openingBalance).toFixed(2);
    const { userId } = req.user;
    try {
      const account = await accountModel.createAccount(userId, type, openingBalanceF);
      res.status(200).json({
        status: 200,
        data: account,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: 'Internal server error',
      });
    }
  }
}

export default AccountController;
