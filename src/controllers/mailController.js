const { registerService } = require("../services/userService");
const { isGmail, isPasswordValid } = require("../utils/validator");

const register = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			const error = new Error("Make Sure to fill all form!!!");
			error.statusCode = 400;
			throw error;
		}
		if (!isGmail) {
			const error = new Error("email must end with @gmail.com!!!");
			error.statusCode = 400;
			throw error;
		}
		if (!isPasswordValid) {
			const error = new Error("Password must be at least 8 characters");
			error.statusCode = 400;
			throw error;
		}

        const newUser = await registerService(email, password);

        res.status(201).josn({
            status: "Success",
            message: "User Created Successfully. Please check your email to activate your account.",
            data: newUser
        })
	} catch (error) {
        if (!error.statusCode) {
			error.statusCode = 500;
			error.message = "There's Something Wrong with The Server!";
		}

        next(error);
    }
};

module.exports = { register }