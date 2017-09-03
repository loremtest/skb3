import express from 'express';
import fetch from 'isomorphic-fetch';

const router = express.Router();

const pc = (async function () {
  const url = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';
  const result = fetch(url)
    .then(res => res.json())
    .catch(e => console.log('!error', e));
  return await result;
}());

router.use('/volumes', async (req, res) => {
  const volumes = pc.hdd.reduce((resHDD, hdd) => {
    const result = resHDD;
    if (!result.hasOwnProperty(hdd.volume)) {
      result[hdd.volume] = 0;
    }
    result[hdd.volume] += hdd.size;
    return result;
  }, {});

  Object.keys(volumes).forEach(volume => (volumes[volume] = `${volumes[volume]}B`));
  res.json(volumes);
});

function getValueByPath(obj, path) {
  const keys = path.replace(/^\//, '').replace(/\/$/, '').split('/');
  let item = obj;

  if (keys[0].length === 0) {
    keys.pop();
  }

  for (let i = 0; i < keys.length; i += 1) {
    const prop = keys[i];
    if (!item.propertyIsEnumerable(prop)) {
      return false;
    }
    item = item[prop];
  }
  return { value: item };
}

router.use(async (req, res) => {
  console.log('task', req.url);
  const result = getValueByPath(pc, req.url);
  if (result !== false) {
    return res.json(result.value);
  }
  return res.status(404).send('Not Found');
});

export default router;
