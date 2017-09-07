import fetch from 'isomorphic-fetch';
import _ from 'lodash';

import StatPokemons from '../models/StatPokemons';
import Pokemon from '../models/Pokemon';

const baseUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=50';
const delayPage = 2000;
const limitRequest = 1500;
let isFinished = false;

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function getPokemon(url) {
  let pokemon;

  const existsPokemon = await Pokemon.findOne({ url });
  if (existsPokemon) {
    return false;
  }

  const response = await fetch(url);
  pokemon = await response.json();
  pokemon = _.pick(pokemon, ['url', 'name', 'height', 'weight']);

  if (!pokemon.name) {
    throw new Error(`- ${url} ${JSON.stringify(pokemon)}`);
  }

  pokemon.url = url;
  console.log(`+ ${pokemon.url}`);

  // save to db
  pokemon = await Pokemon.create(pokemon);
  await StatPokemons.updateSuccess(1);
  return pokemon;
}

async function parsePokemonPage(pageUrl) {
  try {
    const { total = 0 } = await StatPokemons.findOne() || {};

    if (!total) {
      await StatPokemons.remove({});
      await StatPokemons.create({ pageUrl });
    }

    // exit if all pokemons has been parsed
    const countPokemonInDb = await Pokemon.count();
    if (total && countPokemonInDb >= total) {
      isFinished = true;
      return;
    }

    // get page
    await StatPokemons.updatePageUrl(pageUrl);
    console.log(`PAGE: ${pageUrl}`);
    const response = await fetch(pageUrl);
    const page = await response.json();

    if (!page.results) {
      throw new Error(`pokemons not found, ${JSON.stringify(page)}`);
    }

    await StatPokemons.updateTotal(page.count);

    // get pokemons from page
    let requestCount = 0;
    const pokemonPromises = page.results.map(async ({ url: pokemonUrl }) => {
      if (requestCount >= limitRequest) {
        return console.log(`... query limit exceeded ${pokemonUrl}`);
      }
      requestCount += 1;
      return getPokemon(pokemonUrl);
    });

    const results = await Promise.all(pokemonPromises);

    const success = results.filter(pokemon => (typeof pokemon === 'object'));
    console.log(`success loaded from page: ${success.length} of ${pokemonPromises.length}`);

    // parse next page
    if (page.next) {
      await delay(delayPage);
      await parsePokemonPage(page.next);
    }

    isFinished = true;
  } catch (e) {
    console.error('!!! error parsePokemonPage :', e);
    isFinished = true;
    throw e;
  }
}


async function parseAllPokemons() {
  if (isFinished) {
    return;
  }
  const { pageUrl = baseUrl } = await StatPokemons.findOne() || {};
  await parsePokemonPage(pageUrl);
}

export default parseAllPokemons;
