import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  pokemon_cache: defineTable({
    pokemonName: v.string(),
    runId: v.string(),
    data: v.any(),
  }).index("by_name_run", ["pokemonName", "runId"]),
});
