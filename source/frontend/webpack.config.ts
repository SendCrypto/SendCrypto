import * as path from 'path';

//__dirname setting is from https://thewebdev.info/2022/02/27/how-to-use-__dirname-in-node-js-when-using-es6-modules/
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
	entry: {
		sendCryptoBundle: './transpiled/frontend/public/js/sendCryptoBundle.js',
	},
	mode: 'production',
	//target: 'web', //seems to be default, no need to specify: https://webpack.js.org/configuration/target/
	output: {
		path: path.resolve(__dirname, '../../dist/frontend/public/js'),
		publicPath: 'js/',
	},
	performance: {
		//Note: It would be better to more substantively address performance issue with large bundle sizes,
		//disabling these to get the warning back and then responding more appropriately.
		maxEntrypointSize: 1024000,
		maxAssetSize: 1024000
	},
}
