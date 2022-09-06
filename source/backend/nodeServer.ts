const express = require('express');
const app = express();
const port = 92522; //EthOnline deadline is 9/25/2022

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
