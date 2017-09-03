import express from 'express';
import cors from 'cors';

import task3A from './router/task3A';
import task3B from './router/task3B';

function log(...args) {
  return console.log.apply(this, args);
}

const app = express();
app.use(cors());

app.use('/', (req, res, next) => {
  // log(`${req.method} ${req.url}`);
  next();
});

app.use('/task3A', task3A);
app.use('/task3B', task3B);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('!!! index.js catch error:', err.message);
  res.status(404).send('Not Found');
});

app.listen(3000, 'localhost', () => log('server has been started'));
