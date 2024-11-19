const nodemailer = require("nodemailer");

const sendEmailActivationService = (data) => {
	let { email, activation_token } = data;

	const transport = nodemailer.createTransport({
		host: "smtp.gmail.com",
		auth: {
			user: "quezera20@gmail.com",
			pass: process.env.PASSW,
		},
	});

	const linkActivation = `http://localhost:9090/api/v1/activation-page/${activation_token}`;

	const mailOption = {
		from: '"MyApp" <no-reply@yourdomain.com>',
		to: email,
		subject: "Email Activation",
		html: `Press <a href="${linkActivation}">here</a> to verify your account!!!`,
	};

	transport.sendMail(mailOption, (err, info) => {
		if (err) {
			console.log(err, "-> An Error Mate");
		} else {
			console.log(info.response, "-> this is an info");
			console.log("Email Successfully Sent");
		}
	});
};

const sendEmailForgotPasswordService = (data) => {
	let { email, reset_pw_token } = data;

	const transport = nodemailer.createTransport({
		host: "smtp.gmail.com",
		auth: {
			user: "quezera20@gmail.com",
			pass: process.env.PASSW,
		},
	});

	const linkReset = `http://localhost:9090/api/v1/reset-password-page/${reset_pw_token}`;

	const mailOption = {
		from: '"MyApp" <no-reply@yourdomain.com>',
		to: email,
		subject: "Reset Password",
		html: `Press <a href="${linkReset}">here</a> to reset your password!!!`,
	};

	transport.sendMail(mailOption, (err, info) => {
		if (err) {
			console.log(err, "-> An Error Mate");
		} else {
			console.log(info.response, "-> this is an info");
			console.log("Email Successfully Sent");
		}
	});
};

module.exports = { sendEmailActivationService, sendEmailForgotPasswordService };
