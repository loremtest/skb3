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
  let pets;
  try {
    pets = Pet.find(petsSearchParams);
    // populate
    if (populate) {
      pets = pets.populate('user');
    }
    pets = await pets.sort('id');
  } catch (e) {
    return next(e);
  }
  return res.json(pets);
});

router.get('/:id:populate(/populate)?', async (req, res, next) => {
  const { id, populate } = req.params;
  let pet;
  try {
    pet = Pet.findOne({ id });
    if (populate) {
      pet = pet.populate('user');
    }
    pet = await pet;
  } catch (e) {
    return next(e);
  }
  if (!pet) {
    return next(new Error('pet not found'));
  }
  return res.json(pet);
});

export default router;

