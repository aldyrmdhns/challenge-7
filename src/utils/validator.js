const isGmail = (email) => {
	return email.endsWith("@gmail.com");
};

const isPasswordValid = (password) => {
	return password.length >= 8;
};

module.exports = { isGmail, isPasswordValid };