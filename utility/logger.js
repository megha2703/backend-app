//Task 6: Error Handling and Logging

const winston = require('winston');

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'errors.log' }),
    new winston.transports.Console()
  ]
});

function errorHandler(err, req, res, next) {
  logger.error({
    message: err.message,
    method: req.method,
    url: req.originalUrl
  })

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: 'error',
    message: err.message
  });
}

module.exports = errorHandler;
