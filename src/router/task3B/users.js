import express from 'express';
import User from '../../models/User';
import Pet from '../../models/Pet';

const router = express.Router();

router.get('/:populate(populate)?', async (req, res, next) => {
  const { populate } = req.params;
  const query = req.query;
  const searchParams = {};
  const sort = 'id';
  let users;
  try {
    /** @namespace query.havePet */
    if (query.havePet) {
      const pets = await Pet.find({ type: query.havePet });
      const userIds = pets.map(({ userId }) => userId);
      searchParams.id = { $in: userIds };
    }
    users = User.find(searchParams, null, { sort });
    if (populate) {
      users = users.populate({
        path: 'pets',
        options: { sort },
      });
    }
    users = await users;
  } catch (e) {
    return next(e);
  }
  return res.json(users);
});

router.get('/(:id(\\d+)|:username([^/]+)):showPets(/pets)?:populate(/populate)?', async (req, res, next) => {
  const { id, username, showPets, populate } = req.params;
  const userSearchParams = {};
  const petsSearchParams = {};
  const sort = 'id';
  try {
    // by username
    if (username) {
      const user = await User.findOne({ username }, null, { sort });
      if (!user) {
        return next(new Error(`username ${username} not found`));
      }
      userSearchParams.username = username;
      petsSearchParams.userId = user.id;
    } else {
    // by id
      userSearchParams.id = id;
      petsSearchParams.userId = id;
    }
    let result;
    // request to db
    if (!showPets) {
      result = User.findOne(userSearchParams, null, { sort });
      if (populate) {
        result = result.populate({
          path: 'pets',
          options: { sort },
        });
      }
    } else {
      result = Pet.find(petsSearchParams, null, { sort });
    }
    result = await result;
    if (!result) {
      return next(new Error('not found'));
    }
    // send result
    return res.json(result);
  } catch (e) {
    return next(e);
  }
});

export default router;

