const validator = require('../helpers/validate');

const saveBooks = (req, res, next) => {
  const validationRule = {
    bookTitle: 'required|string',
    authorName: 'required|string',
    borrowerName: 'required|string',
    dateBorrowed: 'required|string',
    dateReturn: 'required|string',
    phoneNumber: 'required|string',
    librarian: 'required|string',

  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

module.exports = {
  saveBooks
};