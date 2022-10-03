import express from 'express';
import * as path from 'path';
//__dirname setting is from https://thewebdev.info/2022/02/27/how-to-use-__dirname-in-node-js-when-using-es6-modules/
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
export class ExpressServer {
	constructor(port: number = 80) { //Was 25922 b/c EthOnline deadline is 25 Sept 2022
		app.use('/', express.static('./dist/frontend/public'));
		app.get('/?*', function(req, res) {res.sendFile(path.join(__dirname , '../frontend/public/index.html'))});
		app.listen(port, () => {
			console.log(`SendCrypto server is now listening at http://localhost:${port}`);
		})
	}
}
