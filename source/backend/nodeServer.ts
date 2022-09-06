const express = require('express');
const path = require('path');
const app = express();
const port = 92522; //EthOnline deadline is 9/25/2022

app.get('/', express.static(path.join(__dirname, '../frontend/public')));

app.listen(port, () => {
	console.log(`SendCrypto server is now listening at http://localhost:${port}`);
})
