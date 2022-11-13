const { Router } = require('express');
const { body } = require('express-validator');

const { postPeople, postConnections } = require('../controller/people');
const { handleErrors } = require('../middleware/validationResults');
const { checkPeople, checkTrust } = require('../validators/validators');

const router = Router();

router.post('/', checkPeople, handleErrors, postPeople);

router.post(
  '/:id/trust_connections',
  checkTrust,
  handleErrors,
  postConnections
);

module.exports = router;
