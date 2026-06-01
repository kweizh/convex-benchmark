import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const getCachedPokemon = query({
  args: { pokemonName: v.string(), runId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pokemon_cache")
      .withIndex("by_pokemon_and_runId", (q) =>
        q.eq("pokemonName", args.pokemonName).eq("runId", args.runId)
      )
      .first();
  },
});

export const cachePokemon = mutation({
  args: { pokemonName: v.string(), runId: v.string(), data: v.any() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pokemon_cache")
      .withIndex("by_pokemon_and_runId", (q) =>
        q.eq("pokemonName", args.pokemonName).eq("runId", args.runId)
      )
      .first();
    
    if (!existing) {
      await ctx.db.insert("pokemon_cache", {
        pokemonName: args.pokemonName,
        runId: args.runId,
        data: args.data,
        name: args.data.name,
        weight: args.data.weight,
      });
    }
  },
});

export const getPokemon = action({
  args: { pokemonName: v.string(), runId: v.string() },
  handler: async (ctx, args) => {
    const cached = await ctx.runQuery(api.pokemon.getCachedPokemon, {
      pokemonName: args.pokemonName,
      runId: args.runId,
    });

    if (cached) {
      return cached.data || { name: cached.name, weight: cached.weight };
    }

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${args.pokemonName.toLowerCase()}`);
    if (!response.ok) {
      throw new Error("Pokemon not found");
    }
    const data = await response.json();

    const pokemonData = {
      name: data.name,
      weight: data.weight,
    };

    await ctx.runMutation(api.pokemon.cachePokemon, {
      pokemonName: args.pokemonName,
      runId: args.runId,
      data: pokemonData,
    });

    return pokemonData;
  },
});