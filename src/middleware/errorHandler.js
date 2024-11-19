const Sentry = require("../config/sentry");

const errorHandler = (error, req, res, next) => {
	Sentry.captureException(error);

	const message = error.message;

	req.io.emit("notification", message);
};

module.exports = errorHandler;
