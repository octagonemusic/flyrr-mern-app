const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // this will be caught by errorHandler
};

const errorHandler = (err, req, res, next) => {
  // sometimes the error will have a 200 status code, so we want to set it to 500 if it's not already set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    // if we're in production, don't show the stack trace
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
