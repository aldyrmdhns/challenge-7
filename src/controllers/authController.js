const bycrpt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
	sendEmailActivationService,
	sendEmailForgotPasswordService,
} = require("../services/mailService");
const {
	registerService,
	activationService,
	loginService,
	forgotPasswordService,
	resetPasswordService,
	newActivationTokenService,
	newResetPasswordTokenService,
} = require("../services/authService");
const { isGmail, isPasswordValid } = require("../utils/validator");

const register = async (req, res, next) => {
	try {
		const { email, password, cpassword } = req.body;

		if (!email || !password || !cpassword) {
			const error = new Error("Make Sure to fill all form!!!");
			error.statusCode = 400;
			throw error;
		}
		if (!isGmail(email)) {
			const error = new Error("email must end with @gmail.com!!!");
			error.statusCode = 400;
			throw error;
		}
		if (!isPasswordValid(password)) {
			const error = new Error(
				"Password must be at least 8 characters!!!"
			);
			error.statusCode = 400;
			throw error;
		}
		if (cpassword !== password) {
			const error = new Error(
				"Password is not the same as the previous one!!!"
			);
			error.statusCode = 400;
			throw error;
		}

		const checkEmail = await prisma.user.findUnique({
			where: { email: email },
		});

		if (checkEmail && !checkEmail.activated) {
			const newActivationToken = await newActivationTokenService(
				checkEmail
			);

			if (newActivationToken) {
				sendEmailActivationService(newActivationToken);
				req.io.emit(
					"notification",
					"Activate your Account first! Please Check Your Email"
				);
				res.redirect("login-page");
			}
		}

		if (checkEmail && checkEmail.activated) {
			const error = new Error("Email already in use!!!");
			error.statusCode = 400;
			throw error;
		}

		if (!checkEmail) {
			const newUser = await registerService(req.body);

			if (newUser) {
				sendEmailActivationService(newUser);
				req.io.emit(
					"notification",
					"Account Created Successfuly! Please Check Your Email"
				);
				// res.redirect("login-page");
			}
		}
	} catch (error) {
		next(error);
	}
};

const activation = async (req, res, next) => {
	try {
		const jwtToken = req.params.activation_token;

		if (!jwtToken) {
			const error = new Error("Empty Activation Token!!!");
			error.statusCode = 400;
			throw error;
		}

		const activation = await activationService(jwtToken);

		if (activation) {
			res.redirect("http://localhost:9090/api/v1/login-page");
		}
	} catch (error) {
		next(error);
	}
};

const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await prisma.user.findUnique({ where: { email: email } });

		if (!email || !password) {
			const error = new Error("Make Sure to fill all form!!!");
			error.statusCode = 400;
			throw error;
		}
		if (!isGmail(email)) {
			const error = new Error("email must end with @gmail.com!!!");
			error.statusCode = 400;
			throw error;
		}
		if (!isPasswordValid(password)) {
			const error = new Error(
				"Password must be at least 8 characters!!!"
			);
			error.statusCode = 400;
			throw error;
		}
		if (!user) {
			const error = new Error("Email or Password is Incorrect!!!");
			error.statusCode = 400;
			throw error;
		}
		if (!user.activated) {
			const error = new Error(
				"Account is not activated. Please check your email to activate your account!!!"
			);
			error.statusCode = 400;
			throw error;
		}

		const comparePassword = await bycrpt.compare(password, user.password);

		if (!comparePassword) {
			const error = new Error("Email or Password is Incorrect!!!");
			error.statusCode = 400;
			console.log("the here");
			throw error;
		}

		const { accessToken } = await loginService(req.body);
		console.log(accessToken, "-> access Token");

		res.cookie("token", accessToken, {
			httpOnly: true,
			maxAge: 3 * 60 * 60 * 1000,
		});

		res.redirect("home");
	} catch (error) {
		next(error);
	}
};

const forgotPassword = async (req, res, next) => {
	try {
		const { email } = req.body;

		if (!email) {
			const error = new Error("Make Sure to insert your email!!!");
			error.statusCode = 400;
			throw error;
		}
		if (!isGmail(email)) {
			const error = new Error("email must end with @gmail.com!!!");
			error.statusCode = 400;
			throw error;
		}

		const checkEmail = await prisma.user.findUnique({
			where: { email: email },
		});

		if (!checkEmail) {
			console.log("here1");
			const error = new Error("Email Not Found!!!");
			error.statusCode = 404;
			throw error;
		}
		if (
			checkEmail &&
			checkEmail.reset_pw_token === "" &&
			checkEmail.activated === false
		) {
			const error = new Error(
				"Account is not activated. Please check your email to activate your account!!!"
			);
			error.statusCode = 400;
			throw error;
		}
		if (
			checkEmail &&
			checkEmail.reset_pw_token !== "" &&
			checkEmail.activated === true
		) {
			console.log("here3");
			const newResetToken = await newResetPasswordTokenService(
				checkEmail
			);

			if (newResetToken) {
				sendEmailForgotPasswordService(newResetToken);
				req.io.emit(
					"notification",
					"Email For Reset Password Has been Send! Please Check Your Email"
				);
				res.redirect("login-page");
			}
		}
		if (
			checkEmail &&
			checkEmail.reset_pw_token === "" &&
			checkEmail.activated === true
		) {
			console.log("here4");
			const getPasswordToken = await forgotPasswordService(req.body);
			console.log(getPasswordToken);

			if (getPasswordToken) {
				sendEmailForgotPasswordService(getPasswordToken);
				req.io.emit(
					"notification",
					"Email For Reset Password Has been Send! Please Check Your Email"
				);
				res.redirect("login-page");
			}
		}
	} catch (error) {
		next(error);
	}
};

const resetPassword = async (req, res, next) => {
	try {
		const jwtToken = req.params.reset_pw_token;
		let { password, cpassword } = req.body;

		if (!jwtToken) {
			const error = new Error("Empty Activation Token!!!");
			error.statusCode = 400;
			throw error;
		}

		if (!isPasswordValid(password)) {
			const error = new Error(
				"Password must be at least 8 characters!!!"
			);
			error.statusCode = 400;
			throw error;
		}
		if (cpassword !== password) {
			const error = new Error(
				"Password is not the same s previous one!!!"
			);
			error.statusCode = 400;
			throw error;
		}

		const resetPassword = await resetPasswordService(jwtToken, password);

		if (resetPassword) {
			req.io.emit("notification", "Your Password Has been Changed!");
			res.redirect("http://localhost:9090/api/v1/login-page");
		}
	} catch (error) {
		next(error);
	}
};

module.exports = { register, activation, login, forgotPassword, resetPassword };
