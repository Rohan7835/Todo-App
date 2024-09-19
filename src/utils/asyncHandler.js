const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export { asyncHandler };
