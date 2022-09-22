import * as path from 'path';

export default {
	entry: {
		sendCryptoBundle: './transpiled/frontend/public/js/sendCryptoBundle.js',
	},
	mode: 'production',
	output: {
		path: path.resolve(__dirname, '../../dist/frontend/public/js'),
		publicPath: 'js/',
	},
	performance: {
		//Note: It would be better to more substantively address performance issue with large bundle sizes,
		//disabling these to get the warning back and then responding more appropriately.
		maxEntrypointSize: 512000,
		maxAssetSize: 512000
	},
}
