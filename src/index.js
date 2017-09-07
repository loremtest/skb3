import express from 'express';
import cors from 'cors';

import initDb from './db';

import task3A from './router/task3A';
import task3B from './router/task3B';
import task3C from './router/task3C';

const app = express();
app.use(cors());

initDb();

app.use('/task3A', task3A);
app.use('/task3B', task3B);
app.use('/task3C', task3C);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('!!! index.js catch error:', err);
  res.status(404).send('Not Found');
});

app.listen(3000, 'localhost', () => console.log('server has been started'));
