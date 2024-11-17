const bycrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const SALT = parseInt(process.env.SALT, 10);

const registerService = async (data) => {
	try {
		let { email, password } = data;

		const isExist_email = await prisma.user.findUnique({
			where: { email: email },
		});

		if (isExist_email) {
			throw {
				status: 400,
				message: "Email Already Used",
			};
		}

		const hashedPassword = await bycrpt.hash(password, SALT);

		const activationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
			expiresIn: "3h",
		});

		const newUser = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				asctivated: false,
				jwt_token: activationToken,
			},
		});

		return newUser;
	} catch (error) {
		console.log(error);
	}
};

module.exports = { registerService };
