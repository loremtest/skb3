import express from 'express';
import Pet from '../../models/Pet';
import User from '../../models/User';

const router = express.Router();

router.get('/:populate(populate)?', async (req, res, next) => {
  const { populate } = req.params;
  const query = req.query;
  const {
    type,
    age_gt: ageGt,
    age_lt: ageLt,
  } = query;
  const sort = 'id';
  // query params
  const petsSearchParams = {};
  if (type) {
    petsSearchParams.type = type;
  }
  if (ageGt) {
    petsSearchParams.age = { ...petsSearchParams.age, $gt: ageGt };
  }
  if (ageLt) {
    petsSearchParams.age = { ...petsSearchParams.age, $lt: ageLt };
  }
  // result
  try {
    const pets = (populate)
      ? await Pet.find(petsSearchParams, null, { sort }).populate('user')
      : await Pet.find(petsSearchParams, null, { sort });
    if (!pets) {
      return next(new Error('pets not found'));
    }
    return res.json(pets);
  } catch (e) {
    return next(e);
  }
});

router.get('/:id:populate(/populate)?', async (req, res, next) => {
  const { id, populate } = req.params;
  try {
    const pet = (populate)
      ? await Pet.findOne({ id }).populate('user')
      : await Pet.findOne({ id });
    if (!pet) {
      return next(new Error('pet not found'));
    }
    return res.json(pet);
  } catch (e) {
    return next(e);
  }
});

export default router;

