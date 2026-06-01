import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const checkCache = query({
  args: {
    pokemonName: v.string(),
    runId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pokemon_cache")
      .withIndex("by_pokemonName_runId", (q) =>
        q.eq("pokemonName", args.pokemonName).eq("runId", args.runId)
      )
      .unique();
  },
});

export const saveToCache = mutation({
  args: {
    pokemonName: v.string(),
    runId: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("pokemon_cache", {
      pokemonName: args.pokemonName,
      runId: args.runId,
      data: args.data,
    });
  },
});

export const getPokemon = action({
  args: {
    pokemonName: v.string(),
    runId: v.string(),
  },
  handler: async (ctx, args) => {
    const cached = await ctx.runQuery(api.api.checkCache, {
      pokemonName: args.pokemonName,
      runId: args.runId,
    });

    if (cached) {
      console.log("Returning cached data for", args.pokemonName);
      return cached.data;
    }

    console.log("Fetching from PokeAPI for", args.pokemonName);
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${args.pokemonName.toLowerCase()}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch pokemon: ${response.statusText}`);
    }
    const data = await response.json();

    const pokemonData = {
      name: data.name,
      weight: data.weight,
    };

    await ctx.runMutation(api.api.saveToCache, {
      pokemonName: args.pokemonName,
      runId: args.runId,
      data: pokemonData,
    });

    return pokemonData;
  },
});
