const Sentry = require("@sentry/node");

Sentry.init({
	dsn: process.env.DSN_SENTRY,
	environment: process.env.NODE_ENV,
	maxBreadcrumbs: 50,
	tracesSampleRate: 1.0,
});

module.exports = Sentry;
