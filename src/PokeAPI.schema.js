import { z } from "zod";

export const POKEMON_CARD_SCHEMA = z.object({
    id: z.string(),
    name: z.string(),
    images: z.object({
        large: z.string(),
    }),
    rarity: z.string(),
    number: z.string(),
});

export const POKEMON_RESPONSE_SCHEMA = z.object({
    data: POKEMON_CARD_SCHEMA.optional().array().nonempty(),
    pageSize: z.number(),
    page: z.number(),
    count: z.number(),
    totalCount: z.number(),
});

export class PokemonCard {
    constructor(id, name, img, rarity, number) {
        this.id = id;
        this.name = name;
        this.img = img;
        this.rarity = rarity;
        this.number = number;
    }
}
