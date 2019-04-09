import { validationResult } from 'express-validator/check';

const validateResult = (req, res, next) => {
  const errors = validationResult(req);

  // if we have any errors
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({
        status: 400,
        // return our custom message
        error: errors.array().map(i => i.msg)[0],
      });
  }
  // else pass control to the next middleware
  return next();
};

export default validateResult;
