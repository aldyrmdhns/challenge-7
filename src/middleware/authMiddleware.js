const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
	const token = req.cookies.token;

	try {
		if (!token) {
			const error = new Error("Unauthorized Person!!!");
			error.isAuthMiddleware = true
			error.statusCode = 401;
			throw error;
		}

		jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
			if (err) {
                res.clearCookie("token");
				const error = new Error("Unauthorized Person");
				error.isAuthMiddleware = true
				error.statusCode = 401;
				throw error;
			}

			console.log(decode, '-> from authMiddleware');
			next();
		});
	} catch (error) {
		next(error);
		res.redirect('http://localhost:9090/api/v1/error-page')
	}
};

module.exports = authentication;
