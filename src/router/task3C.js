import express from 'express';

import parseAllPokemons from './parseAllPokemons';
import Pokemon from '../models/Pokemon';

const router = express.Router();

router.use('/', async (req, res, next) => {
  await parseAllPokemons();
  next();
});

router.get('/', async (req, res, next) => {
  try {
    const query = req.query;

    let limit = Number(query.limit);
    limit = (limit && limit > 0 && limit < 500) ? limit : 20;

    let offset = Number(query.offset);
    offset = (offset && offset > 0) ? offset : 0;

    const sort = {
      name: 1,
      fat: 1,
    };

    let result = await Pokemon.aggregate([
      {
        $project: {
          _id: false,
          name: true,
          fat: { $divide: ['$weight', '$height'] },
        },
      },
      { $sort: sort },
      { $skip: offset },
      { $limit: limit },
    ]);

    result = result.map(({ name }) => name);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
