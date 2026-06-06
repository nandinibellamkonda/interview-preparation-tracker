const errorMiddleware = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Unexpected server error.' });
};

module.exports = errorMiddleware;
