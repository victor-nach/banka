import helper from './helper';

class Notifications {
  /**
   * @static sendTransaction
   * @param { Object } transaction
   * @param { Object } user
   * @description sends transaction notifications
   * @memberof Notifications
   */
  static sendTransaction(transaction, user) {
    const to = user.email;
    const subject = `BANKA Transaction Notification Services (BANKA ALERT): ${transaction.type}: `;
    const html = `
            <p>
                Dear <em style="text-transform: capitalize">${user.firstName} ${user.lastName}</em>, <br>

                This is to inform you that a transaction has occurred on your account with BANKA with details below: <br>

                <table style="border: 1px solid">
                  <tr><table style="border: 1px solid">
                  <tr>
                    <td style="border: 1px solid">Account Number</td>
                    <td style="border: 1px solid">${transaction.accountNumber}</td> 
                  </tr>
                  <tr>
                    <td style="border: 1px solid">Transaction Time</td>
                    <td style="border: 1px solid">${transaction.createdOn}</td> 
                  </tr>
                  <tr>
                    <td style="border: 1px solid">Amount</td>
                    <td style="border: 1px solid">${transaction.amount}</td> 
                  </tr>
                  <tr>
                    <td style="border: 1px solid">Balance</td>
                    <td style="border: 1px solid">${transaction.newBalance}</td> 
                  </tr>
                </table>
            </p>    
    `;
    helper.mailHandler(to, subject, html);
  }

  /**
   * @static sendPassordReset
   * @param { Object } link password reset link
   * @param { Object } user
   * @description sends password reset link
   * @memberof Notifications
   */
  static sendResetLink(link, user) {
    const to = user.email;
    const subject = 'BANKA Notification Services (PASSWORD RESET)';
    const html = `
            <p>
                Dear <em style="text-transform: capitalize">${user.firstName} ${user.lastName}</em>, <br>

                you have requested for a password reset, kindly follow the one time link below to change your password <br>
                ${link} <br>
                
                If you did not request for a password reset, please ignore this email or reply to let us know.

                best regards, bankai.
            </p>    
    `;
    helper.mailHandler(to, subject, html);
  }
}

export default Notifications;
