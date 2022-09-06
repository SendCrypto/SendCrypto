const express = require('express');
const app = express();
export class ExpressServer {
	constructor(port: number = 25922) { //EthOnline deadline is 25 Sept 2022
		app.use('/', express.static('./dist/frontend/public'));
		app.listen(port, () => {
			console.log(`SendCrypto server is now listening at http://localhost:${port}`);
		})
	}
}
