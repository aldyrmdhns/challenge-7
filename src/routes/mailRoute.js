const express = require("express");
const {
	register,
	activation,
	login,
	forgotPassword,
	resetPassword,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const route = express.Router();

route.get("/login-page", (req, res) => {
	res.render("loginPage");
});
route.get("/register-page", (req, res) => {
	res.render("registerPage");
});
route.get("/forgot-password-page", (req, res) => {
	res.render("forgotPasswordPage");
});
route.get("/activation-page/:activation_token?", authMiddleware, (req, res) => {
	const activation_token = req.params.activation_token;
	res.render("activationPage", {activation_token});
});
route.get("/reset-password-page/:reset_pw_token?", authMiddleware, (req, res) => {
	const reset_pw_token = req.params.reset_pw_token;
	res.render("resetPasswordPage", { reset_pw_token });
});
route.get("/home", authMiddleware, (req, res) => {
	res.render("homePage");
});
route.get("/error-page", (req, res) => {
	res.render("errorPage");
});

route.post("/sign-up", register);
route.post("/sign-in", login);
route.post("/activation", activation)
route.post("/forgot-password", forgotPassword);
route.post("/reset-password/:reset_pw_token?", authMiddleware, resetPassword);

module.exports = route;
