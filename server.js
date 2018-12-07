const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const port = 5555;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));
app.post('/spell', (req, res) => {
  const data = JSON.stringify(req.body);
  // console.log(req.body.text);
  res.json({
    'errors': [
      { 'Lorem Ipsum': ['Hello', 'Hi', 'Nihao', 'Bye bye', 'Love u'] },
      { 'text': ['A', 'B', 'C'] }
    ]
  });
});
app.get('/api', (req, res) => res.json({ 'status': true, 'data': "hello" }));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
