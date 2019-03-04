
function error (customError) {
	return function (req, res, next) {
		if (customError) {
			req.error = customError;
		}
		return next();
	};
};

module.exports = error;
