function errorHandler(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'the user is not authorized',
      success: false,
      body: null,
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(401).json({
      error: err,
      success: false,
      body: null,
    });
  }

  return res.status(500).json({
    error: err,
    success: false,
    body: null,
  });
}

module.exports = errorHandler;
