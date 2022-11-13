const { body } = require('express-validator');
const sharp = require('sharp');

const validators = {
  checkRequest: [
    body('min_level').notEmpty().isInt({ min: 0, max: 100 }),
    body('image')
      .notEmpty()
      .custom(async (val) => {
        const { format, space, depth } = await sharp(
          Buffer.from(val.split('base64,').pop(), 'base64')
        ).metadata();
        return format === 'png' && space === 'b-w' && depth === 'uchar';
      })
      .withMessage('Invalid image format'),
  ],
};

module.exports = validators;
