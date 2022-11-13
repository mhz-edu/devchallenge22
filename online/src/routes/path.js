const { Router } = require('express');

const { postPath } = require('../controller/path');
const { handleErrors } = require('../middleware/validationResults');
const { checkMessagePath } = require('../validators/validators');

const router = Router();

router.post('/', checkMessagePath, handleErrors, postPath);

module.exports = router;
