import express from 'express';
import bodyParser from 'body-parser';

// setup the express app
const app = express();

const PORT = process.env.PORT || 5000;

// parse incoming data with body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to banka 2019' });
});

app.all('*', (req, res) => {
  res.status(404).json({ message: 'Sorry endpoint does not exist' });
});

app.listen(PORT);

export default app;
