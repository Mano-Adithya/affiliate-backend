export default (err, req, res, next) => {
    res.status(err.statusCode || 500);
    res.json({
      message: err?.message,
      stack: err?.stack,
    });
  };
  