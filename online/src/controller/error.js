const serverError = (error, req, res) => {
  res.status(500).json(error);
};

module.exports = { serverError };
