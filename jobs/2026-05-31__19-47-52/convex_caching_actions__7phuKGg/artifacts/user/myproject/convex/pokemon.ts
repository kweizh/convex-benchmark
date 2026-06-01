import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

export const getCachedPokemon = query({
  args: { pokemonName: v.string(), runId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("pokemon_cache")
      .withIndex("by_name_run", (q) =>
        q.eq("pokemonName", args.pokemonName).eq("runId", args.runId),
      )
      .first();
  },
});

export const cachePokemon = mutation({
  args: { pokemonName: v.string(), runId: v.string(), data: v.any() },
  handler: async (ctx, args) => {
    await ctx.db.insert("pokemon_cache", {
      pokemonName: args.pokemonName,
      runId: args.runId,
      data: args.data,
    });
  },
});

export const getPokemon = action({
  args: { pokemonName: v.string(), runId: v.string() },
  handler: async (ctx, args) => {
    const cached = await ctx.runQuery(api.pokemon.getCachedPokemon, {
      pokemonName: args.pokemonName,
      runId: args.runId,
    });

    if (cached?.data) {
      return cached.data;
    }

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${args.pokemonName}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon: ${response.status}`);
    }

    const data = await response.json();

    await ctx.runMutation(api.pokemon.cachePokemon, {
      pokemonName: args.pokemonName,
      runId: args.runId,
      data,
    });

    return data;
  },
});
