import express from 'express';
import fetch from 'isomorphic-fetch';

import saveDataInDb, { clearAllData } from '../../saveDataInDb';
import usersRouter from './users';
import petsRouter from './pets';
import Pet from '../../models/Pet';
import User from '../../models/User';

const router = express.Router();

const dataUrl = 'https://gist.githubusercontent.com/isuvorov/55f38b82ce263836dadc0503845db4da/raw/pets.json';

const importDataInDb = (function init() {
  let isImported = false;
  return async function closure() {
    if (isImported) {
      return;
    }
    try {
      await clearAllData();
      const res = await fetch(dataUrl);
      const data = await res.json();
      if (!data) {
        return;
      }
      const saveData = {
        users: [],
        pets: [],
        ...data,
      };
      const result = await saveDataInDb(saveData);
      isImported = true;
      console.log(`...gist imported. Users:${result.users.length}, Pets:${result.pets.length}`);
    } catch (e) {
      console.error('!!! error import:', e.message);
    }
  };
}());

router.use('/', async (req, res, next) => {
  await importDataInDb();
  next();
});

router.use('/', (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

router.get('/', async (req, res) => {
  const users = await User.find({}, null, { sort: 'id' });
  const pets = await Pet.find({}, null, { sort: 'id' });
  res.json({
    users,
    pets,
  });
});

router.use('/users', usersRouter);
router.use('/pets', petsRouter);

export default router;

