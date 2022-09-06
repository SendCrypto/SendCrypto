import * as path from 'path';

export default {
	entry: {
		sendCryptoBundle: './transpiled/public/js/sendCryptoBundle.js',
	},
	output: {
		path: path.resolve(__dirname, '../dist/public/js'),
		publicPath: 'js/',
	}
}
