const { Router } = require('express');

const { postImage } = require('../controller/images');
const { handleErrors } = require('../middleware/validationResults');
const { checkRequest } = require('../validators/validators');

const router = Router();

router.post('/', checkRequest, handleErrors, postImage);

module.exports = router;
