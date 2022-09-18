module.exports = ({ production = false }) => {
	if (production) {
		return require('./webpack.prod');
	}

	return require('./webpack.dev');
};
