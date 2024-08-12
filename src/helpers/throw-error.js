export default (err, code = 500) => {
    const error = new Error(err);
    error.statusCode = code;
    throw error;
  };
  