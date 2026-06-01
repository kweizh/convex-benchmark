import { v } from "convex/values";
import { internalQuery, internalMutation } from "./_generated/server";

// Internal query to check if pokemon data is cached
export const getCachedPokemon = internalQuery({
  args: {
    pokemonName: v.string(),
    runId: v.string(),
  },
  handler: async (ctx, args) => {
    const cached = await ctx.db
      .query("pokemon_cache")
      .withIndex("by_pokemonName_runId", (q) =>
        q.eq("pokemonName", args.pokemonName).eq("runId", args.runId)
      )
      .first();
    return cached;
  },
});

// Internal mutation to store pokemon data in cache
export const cachePokemon = internalMutation({
  args: {
    pokemonName: v.string(),
    runId: v.string(),
    name: v.string(),
    weight: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("pokemon_cache", {
      pokemonName: args.pokemonName,
      runId: args.runId,
      name: args.name,
      weight: args.weight,
    });
  },
});