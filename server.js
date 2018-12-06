const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/api', (req, res) => res.json({'status': true, 'data': "hello"}));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
