const bycrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const SALT = parseInt(process.env.SALT, 10);

const registerService = async (data) => {
	try {
		let { email, password } = data;

		console.log(data, "-> this is from data");

		const hashedPassword = await bycrpt.hash(password, SALT);

		const activationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		const newUser = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				activated: false,
				activation_token: activationToken,
				reset_pw_token: "",
			},
		});

		return newUser;
	} catch (error) {
		return error;
	}
};

const activationService = async (token) => {
	try {
		let decodedData;

		try {
			decodedData = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			throw err;
		}

		const user = await prisma.user.findUnique({
			where: { email: decodedData.email },
		});

		if (!user) {
			const error = new Error("Invalid or Expired Activation Token!!!");
			error.statusCode = 400;
			throw error;
		}
		if (user.activated) {
			const error = new Error("Account already Activated!!!");
			error.statusCode = 400;
			throw error;
		}

		const activation = await prisma.user.update({
			where: { email: decodedData.email },
			data: { activated: true, activation_token: "" },
		});

		return activation;
	} catch (error) {
		return error;
	}
};

const newActivationTokenService = async (data) => {
	try {
		let { email } = data;
		console.log(email);
		console.log(data);

		const newActivationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		const updateToken = await prisma.user.update({
			where: { email: email },
			data: { activation_token: newActivationToken },
		});

		return updateToken;
	} catch (error) {
		return error;
	}
};

const loginService = async (data) => {
	try {
		const { email, password } = data;

		const user = await prisma.user.findUnique({ where: { email: email } });

		const accessToken = jwt.sign(
			{ userId: user.id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "3h" }
		);

		console.log(accessToken);
		return { accessToken };
	} catch (error) {
		return error;
	}
};

const forgotPasswordService = async (data) => {
	try {
		let { email } = data;

		const user = await prisma.user.findUnique({ where: { email: email } });
		console.log("here iam");

		if (!user) {
			const error = new Error("User Not Found!!!");
			error.statusCode = 404;
			throw error;
		}
		if (!user.activated) {
			console.log("i should be here");
			const error = new Error(
				"Account is not activated. Please check your email to activate your account!!!"
			);
			error.statusCode = 400;
			throw error;
		}

		console.log("i cant be");
		const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		const updateUser = await prisma.user.update({
			where: { email: user.email },
			data: { reset_pw_token: resetToken },
		});

		return updateUser;
	} catch (error) {
		return error;
	}
};

const newResetPasswordTokenService = async (data) => {
	try {
		let { email } = data;
		console.log(email);
		console.log(data);

		const newResetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		const updateToken = await prisma.user.update({
			where: { email: email },
			data: { reset_pw_token: newResetToken },
		});

		return updateToken;
	} catch (error) {
		return error;
	}
};

const resetPasswordService = async (token, password) => {
	try {
		let decodedData;

		try {
			decodedData = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			const error = new Error("Invalid Reset Password Token!!!");
			error.statusCode = 400;
			throw error;
		}

		const user = await prisma.user.findUnique({
			where: { email: decodedData.email },
		});

		if (!user) {
			const error = new Error("Invalid Reset Password Token!!!");
			error.statusCode = 400;
			throw error;
		}

		const hashedPassword = await bycrpt.hash(password, SALT);

		const updatePassword = await prisma.user.update({
			where: { email: user.email },
			data: { password: hashedPassword, reset_pw_token: "" },
		});

		return updatePassword;
	} catch (error) {
		return error;
	}
};

module.exports = {
	registerService,
	activationService,
	loginService,
	forgotPasswordService,
	resetPasswordService,
	newActivationTokenService,
	newResetPasswordTokenService,
};
