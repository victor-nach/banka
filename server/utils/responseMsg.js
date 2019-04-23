class ResponseMsg {
  /**
   * @static responseErr
   * @param { Object } res
   * @param { Number } status
   * @param { Object } message
   * @returns respsonse body
   * @description ddefines the standard response format in the case of an error
   * @memberof ResponseMsg
   */
  static responseErr(res, status, message) {
    return res.status(status).json({ status, error: message });
  }

  /**
   * @static responseErr
   * @param { Object } res
   * @param { Number } status
   * @param { Object } message
   * @returns respsonse body
   * @description ddefines the standard response format when a data object is to be returned
   * @memberof ResponseMsg
   */
  static response(res, status, data) {
    return res.status(status).json({
      status,
      data,
    });
  }

  /**
   *
   *
   * @static
   * @param {*} res
   * @param {*} status
   * @param {*} message
   * @returns
   * @memberof ResponseMsg
   */
  static responseShort(res, status, message) {
    return res.status(status).json({ status, message });
  }
}

export default ResponseMsg;
