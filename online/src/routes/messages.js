const { Router } = require('express');

const { postMessage } = require('../controller/messages');
const { handleErrors } = require('../middleware/validationResults');
const { checkMessagePath } = require('../validators/validators');

const router = Router();

router.post('/', checkMessagePath, handleErrors, postMessage);

module.exports = router;
