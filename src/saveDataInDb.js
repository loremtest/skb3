import Promise from 'bluebird';
import Pet from './models/Pet';
import User from './models/User';

export default async function saveDataInDb(data) {
  const { users = [], pets = [] } = data;

  const usersPromises = users.map((userData) => {
    const user = new User(userData);
    return user.save();
  });

  const usersResolve = await Promise.all(usersPromises);

  const petsPromises = pets.map((petsData) => {
    const pet = new Pet(petsData);
    return pet.save();
  });

  const petsResolve = await Promise.all(petsPromises);

  return {
    users: usersResolve,
    pets: petsResolve,
  };
}

async function clearAllData() {
  await Promise.promisify(User.resetCount)();
  await Promise.promisify(Pet.resetCount)();
  await User.remove();
  await Pet.remove();
}

export { clearAllData };
