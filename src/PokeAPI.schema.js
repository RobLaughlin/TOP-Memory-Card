import { z } from "zod";

export const POKEMON_CARD_SCHEMA = z.object({
    id: z.string(),
    name: z.string(),
    images: z.object({
        large: z.string(),
    }),
    rarity: z.string(),
});

export const POKEMON_RESPONSE_SCHEMA = z.object({
    data: POKEMON_CARD_SCHEMA.optional().array().nonempty(),
    pageSize: z.number(),
    page: z.number(),
    count: z.number(),
    totalCount: z.number(),
});
