import fetch from 'isomorphic-fetch';

import saveDataInDb, { clearAllData } from '../../../saveDataInDb';

const petsData = {};

(async function importDataInDb() {
  try {
    await clearAllData();
    const data = await fetch('https://gist.githubusercontent.com/isuvorov/55f38b82ce263836dadc0503845db4da/raw/pets.json')
      .then(res => res.json())
      .catch(e => console.error('!error load data from gist:', e));
    if (!data) return;
    if (!data.users) data.users = [];
    if (!data.pets) data.pets = [];

    // TODO petsData must contain sorted users and pets list
    await saveDataInDb(data);
    petsData.users = data.users;
    petsData.pets = data.pets;
    console.log(`...gist imported. Users:${petsData.users.length}, Pets:${petsData.pets.length}`);
  } catch (e) {
    console.error('!!! error import:', e.message);
  }
}());

export default petsData;
