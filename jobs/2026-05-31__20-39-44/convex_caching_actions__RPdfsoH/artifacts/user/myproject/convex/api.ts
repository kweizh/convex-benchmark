import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

// Public action to fetch pokemon data (with caching)
export const getPokemon = action({
  args: {
    pokemonName: v.string(),
    runId: v.string(),
  },
  handler: async (ctx, args): Promise<{pokemonName: string; runId: string; name: string; weight: number}> => {
    // Check cache first
    const cached = await ctx.runQuery(internal.cache.getCachedPokemon, {
      pokemonName: args.pokemonName,
      runId: args.runId,
    });

    if (cached) {
      return cached as {pokemonName: string; runId: string; name: string; weight: number};
    }

    // Fetch from PokeAPI
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${args.pokemonName}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch pokemon: ${response.statusText}`);
    }

    const data = await response.json();

    const result = {
      pokemonName: args.pokemonName,
      runId: args.runId,
      name: data.name,
      weight: data.weight,
    };

    // Store in cache
    await ctx.runMutation(internal.cache.cachePokemon, {
      pokemonName: args.pokemonName,
      runId: args.runId,
      name: data.name,
      weight: data.weight,
    });

    return result;
  },
});