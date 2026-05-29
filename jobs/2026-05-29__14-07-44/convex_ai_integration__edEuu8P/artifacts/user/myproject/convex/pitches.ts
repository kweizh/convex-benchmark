"use node";

import { action, internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import OpenAI from "openai";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("repo_pitches").order("desc").collect();
  },
});

export const save = internalMutation({
  args: { repo: v.string(), pitch: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("repo_pitches", {
      repo: args.repo,
      pitch: args.pitch,
    });
  },
});

export const generate = action({
  args: { repo: v.string() },
  handler: async (ctx, args) => {
    const repoResponse = await fetch(`https://api.github.com/repos/${args.repo}`, {
      headers: {
        "User-Agent": "Convex-App",
      },
    });
    
    if (!repoResponse.ok) {
      throw new Error(`Failed to fetch repo data: ${repoResponse.statusText}`);
    }
    
    const repoData = (await repoResponse.json()) as { description: string | null };
    const description = repoData.description || "No description provided.";

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a marketing expert. Generate a 1-sentence promotional pitch for a GitHub repository based on its description.",
        },
        {
          role: "user",
          content: `Repository: ${args.repo}\nDescription: ${description}`,
        },
      ],
    });

    const pitch = response.choices[0].message.content?.trim() || "Could not generate pitch.";

    await ctx.runMutation(internal.pitches.save, {
      repo: args.repo,
      pitch: pitch,
    });

    return pitch;
  },
});
