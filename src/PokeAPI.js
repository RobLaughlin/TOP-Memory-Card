import qs from "qs";
import {
    POKEMON_CARD_SCHEMA,
    POKEMON_RESPONSE_SCHEMA,
} from "./PokeAPI.schema.js";

const BASE_URL = "https://api.pokemontcg.io/v2/cards";

async function fetchPokemon(numRefetches = 3) {
    /**
     * Returns a dictionary of the original 151 pokemon mapping to their corresponding id's.
     * Pokemon cards follow the POKEMON_CARD_SCHEMA zod object, and ar epulled from the base series set.
     */
    const qparams = ["nationalPokedexNumbers:[1 TO 151]", "set.series:Base"];
    const toSelect = POKEMON_CARD_SCHEMA.keyof().options;
    const params = {
        q: qparams.join(" "),
        orderBy: "-number,-rarity",
        select: toSelect.join(),
    };

    const query = (page) => {
        const paramStr = { ...params, page };
        const queryStr = qs.stringify(paramStr);
        return `${BASE_URL}?${queryStr}`;
    };

    const getResponse = async (url, refetches, cache = "force-cache") => {
        if (refetches <= 0) {
            return [null, new Error(`Failed to pull data from API: ${query}`)];
        }
        try {
            const rawRes = await fetch(url, { cache });
            const res = await rawRes.json();
            return [res, null];
        } catch {
            return getResponse(url, refetches - 1, cache);
        }
    };

    const queries = [query(1), query(2)];
    const pokemon = new Map();
    await Promise.all(
        queries.map(async (q) => {
            const [res, err] = await getResponse(q, numRefetches);
            const { success, data } = POKEMON_RESPONSE_SCHEMA.safeParse(res);
            if (err !== null || !success) {
                throw err;
            }

            data.data.forEach((card) => {
                const { id, name, rarity } = card;
                const img = card.images.large;
                pokemon.set(id, { id, name, rarity, img });
            });
        })
    ).catch((err) => {
        throw err;
    });

    return pokemon;
}

fetchPokemon();
