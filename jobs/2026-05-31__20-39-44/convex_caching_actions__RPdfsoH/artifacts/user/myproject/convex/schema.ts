import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  pokemon_cache: defineTable({
    pokemonName: v.string(),
    runId: v.string(),
    name: v.string(),
    weight: v.number(),
  }).index("by_pokemonName_runId", ["pokemonName", "runId"]),
});