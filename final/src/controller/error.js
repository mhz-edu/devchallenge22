const serverError = (error, req, res) => {
  if (!error.status) {
    error.status = 500;
  }
  res.status(error.status).json({ error: error.message, details: error });
};

module.exports = { serverError };
