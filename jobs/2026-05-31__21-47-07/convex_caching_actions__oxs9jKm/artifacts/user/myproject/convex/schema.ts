import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  pokemon_cache: defineTable({
    pokemonName: v.string(),
    runId: v.string(),
    data: v.optional(v.any()),
    name: v.optional(v.string()),
    weight: v.optional(v.number()),
  }).index("by_pokemon_and_runId", ["pokemonName", "runId"]),
});