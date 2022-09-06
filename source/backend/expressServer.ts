import express from 'express';
const app = express();
export class ExpressServer {
	constructor(port: number = 25922) { //EthOnline deadline is 25 Sept 2022
		app.use('/', express.static('./dist/frontend/public/images/favicons'));
		app.use('/', express.static('./dist/frontend/public'));
		app.get('/?*', function(req, res) {res.sendFile(__dirname + './dist/frontend/public/index.html')});
		app.listen(port, () => {
			console.log(`SendCrypto server is now listening at http://localhost:${port}`);
		})
	}
}
