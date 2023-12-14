

function notFound(req: any, res: any, next: any) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

function errorHandler(err: any, req: any, res: any, next: any) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.json({
    code: statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    isError: true,
  });
}

function responseMiddleware(req: any, res: any, next: any) {
  const statusCode = res.statusCode ? res.statusCode : 200;
  res.sendSuccess = function (data: any, message: any, code: number) {
    res.status(statusCode).json({
      isError: false,
      code: code ? code : statusCode,
      data: data,
      message: message,
    });


  };


  res.sendError = function (err: any, code: number) {
    res.status(statusCode).json({
      isError: true,
      code: code ? code : statusCode,
      message: err.message ? err.message : err,
    });
  }

  next();
}

export {
  notFound,
  errorHandler,
  responseMiddleware
};
