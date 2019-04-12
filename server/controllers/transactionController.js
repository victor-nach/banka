import transactionModel from '../models/transactionModel';

class TransactionController {
  static async debitAccount(req, res) {
    const { amount } = req.body;
    const { accountNumber } = req.params;
    const { userType, userId } = req.user;
    const transactionType = 'debit';
    if (userType === 'client') {
      res.status(401).json({
        status: 401, error: 'unauthorized access(user), you need to be an admin',
      });
      return;
    }
    try {
      const transaction = await transactionModel
        .transactions(amount, accountNumber, userId, transactionType);
      const { newBalance, id } = transaction;
      res.status(200).json({
        status: 200,
        data: {
          transactionId: id,
          accountNumber: Number(accountNumber),
          amount,
          cashier: userId,
          transactionType,
          accountBalance: newBalance,
        },
      });
    } catch (error) {
      if (error.name === 'insufficient_funds') {
        res.status(400).json({ status: 400, error: 'Insufficient funds' });
      } else if (error.name === 'account_null') {
        res.status(404).json({ status: 404, error: 'this account number doesn\'t exist' });
      } else if (error.name === 'account_draft') {
        res.status(400).json({ status: 400, error: 'Transaction failed, this account is not yet active (draft)' });
      } else if (error.name === 'account_dormant') {
        res.status(400).json({ status: 400, error: 'Transaction failed, this account is dormant' });
      } else {
        res.status(500).json({ status: 500, error: 'Internal server error broo' });
      }
    }
  }
}

export default TransactionController;
