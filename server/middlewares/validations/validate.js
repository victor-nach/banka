
const numberParams = (req, res, next) => {
  const { accountNumber, id, transactionId } = req.params;
  if ((accountNumber || id || transactionId).match(/^[1-9][0-9]*$/) === null) {
    return res
      .status(400)
      .json({
        status: 400,
        error: `'${accountNumber || id || transactionId}' should be a valid number without any special characters`,
      });
  }
  return next();
};

export default numberParams;
