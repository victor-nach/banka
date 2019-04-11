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
        error: 'Internal server error broo',
      });
    }
  }

  static async editAccount(req, res) {
    const { status } = req.body;
    const { accountNumber } = req.params;
    const { userType, isAdmin } = req.user;
    if (userType === 'client') {
      res.status(401).json({
        status: 401, error: 'unauthorized access(user), you need to be an admin',
      });
    } else if (isAdmin === false) {
      res.status(401).json({
        status: 401, error: 'unauthorized access(staff), you need to be an admin',
      });
    } else {
      try {
        const account = await accountModel.editAccount(status, accountNumber);
        res.status(200).json({
          status: 200,
          data: account,
        });
      } catch (error) {
        if (error.name === 'account_null') {
          res.status(404).json({ status: 404, error: 'Invalid account number, no matches found' });
        } else {
          res.status(500).json({ status: 500, error: 'Internal server error' });
        }
      }
    }
  }
}

export default AccountController;
