import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import swaggerDocument from '../swagger.json';
import router from './routes';

// setup the express app
const app = express();

const PORT = process.env.PORT || 5000;

// parse incoming data with body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1', router);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome to banka 2019',
  });
});

app.all('*', (req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Sorry endpoint does not exist',
  });
});

app.listen(PORT);

export default app;
