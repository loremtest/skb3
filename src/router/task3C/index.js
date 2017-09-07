import express from 'express';

import parseAllPokemons from './parseAllPokemons';
import Pokemon from '../../models/Pokemon';

const router = express.Router();

router.use('/', async (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  await parseAllPokemons();
  next();
});

const metricsMiddleware = async (req, res, next) => {
  try {
    const query = req.query;
    const { metric } = req.params;

    let result = await Pokemon.getByMetric(metric, query);
    result = result.map(({ name }) => name);

    res.json(result);
  } catch (e) {
    next(e);
  }
};

router.get('/', metricsMiddleware);
router.get('/:metric(fat)', metricsMiddleware);
router.get('/:metric(angular)', metricsMiddleware);
router.get('/:metric(heavy)', metricsMiddleware);
router.get('/:metric(light)', metricsMiddleware);
router.get('/:metric(huge)', metricsMiddleware);
router.get('/:metric(micro)', metricsMiddleware);

export default router;
