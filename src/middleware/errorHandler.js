const errorHandler = (error, req, res, next) => {
	Sentry.captureException(err);

	const statusCode = error.statusCode || 500;
	const message = error.message || "There's Something Wrong with The Server!";

	res.status(statusCode).json({
		status: "Failed",
		message: message,
	});
};

module.exports = errorHandler;
