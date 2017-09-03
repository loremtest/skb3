import express from 'express';
import mongoose from 'mongoose';

import { clearAllData } from '../../saveDataInDb';
import petsData from './helpers/parseGist';

import usersRouter from './users';
import petsRouter from './pets';

mongoose.Promise = Promise;
const db = mongoose.connect('mongodb://ex03-mongo.dev/ex03-mongo-dev', { useMongoClient: true });
db.once('open', () => console.log('MongoDB connection successful.'));

const router = express.Router();

router.use('/', (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

router.get('/', async (req, res) => {
  res.json(petsData);
});

router.use('/users', usersRouter);
router.use('/pets', petsRouter);


router.delete('/clear', async (req, res) => {
  await clearAllData();
  petsData.users = [];
  petsData.pets = [];
  return res.send('all clear!');
});

export default router;

