import * as path from 'path';

export default {
	entry: {
		sendCryptoBundle: './transpiled/frontend/public/js/sendCryptoBundle.js',
	},
	output: {
		path: path.resolve(__dirname, '../../dist/frontend/public/js'),
		publicPath: 'js/',
	}
}
