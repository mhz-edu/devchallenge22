const { body, param } = require('express-validator');

const User = require('../model/people');

const validators = {
  checkPeople: [
    body('id')
      .notEmpty()
      .isString()
      .custom(async (id) => {
        if (await User.findOne({ id })) {
          throw new Error(`Person with ${id} is already exist`);
        }
        return true;
      })
      .bail(),
    body('topics')
      .isArray()
      .custom((arr) => {
        if (arr.some((val) => typeof val !== 'string')) {
          throw new Error('Topics must be a string');
        }
        return true;
      }),
  ],
  checkTrust: [
    param('id')
      .custom((value) => {
        if (Number(value)) {
          throw new Error('Person id must be a string');
        }
        return true;
      })
      .custom(async (id) => {
        if (!(await User.findOne({ id }))) {
          throw new Error('Person not found');
        }
        return true;
      })
      .bail(),
    body('*').isInt({ min: 1, max: 10 }),
  ],
  checkMessagePath: [
    body('from_person_id')
      .notEmpty()
      .isString()
      .custom(async (id) => {
        if (!(await User.findOne({ id }))) {
          throw new Error('Person not found');
        }
        return true;
      })
      .bail(),
    body('topics')
      .isArray()
      .custom((arr) => {
        if (arr.some((val) => typeof val !== 'string')) {
          throw new Error('Topics must be a string');
        }
        return true;
      }),
    body('text').notEmpty().isString(),
    body('min_trust_level').isInt({ min: 1, max: 10 }),
  ],
};

module.exports = validators;
