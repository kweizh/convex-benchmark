FROM ubuntu:24.04

RUN apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        curl ca-certificates git python3 python3-pip python3-pytest bash \
        ffmpeg ripgrep libxcb-shm0 libx11-xcb1 libx11-6 libxcb1 libxext6 libxrandr2 libxcomposite1 libxcursor1 libxdamage1 libxfixes3 libxi6 libgtk-3-0t64 libpangocairo-1.0-0 libpango-1.0-0 libatk1.0-0t64 libcairo-gobject2 libcairo2 libgdk-pixbuf-2.0-0 libxrender1 libasound2t64 libfreetype6 libfontconfig1 libdbus-1-3 libnss3 libnspr4 libatk-bridge2.0-0t64 libdrm2 libxkbcommon0 libatspi2.0-0t64 libcups2t64 libxshmfence1 libgbm1 chromium-browser && \
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    npm i -g @getpochi/cli agent-browser && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN agent-browser install || true

RUN mkdir -p /home/user && chmod 0755 /home/user

LABEL Author="any-task-builder"
LABEL Description="React app with Convex initialized for paginated query task."

RUN cd /home/user && \
    npx create-vite@latest app --template react-ts && \
    cd app && \
    npm install && \
    npm install convex && \
    mkdir -p convex && \
    cat > convex/schema.ts <<'EOF'
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
  }),
});
EOF

RUN cd /home/user/app && \
    cat > convex/seed.ts <<'EOF'
import { mutation } from "./_generated/server";

export const seedMessages = mutation({
  handler: async (ctx) => {
    // Delete existing
    const existing = await ctx.db.query("messages").collect();
    for (const msg of existing) {
      await ctx.db.delete(msg._id);
    }
    // Insert 15 messages
    for (let i = 1; i <= 15; i++) {
      await ctx.db.insert("messages", { body: `Message ${i}` });
    }
  },
});
EOF

RUN cd /home/user/app && \
    cat > convex/tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ES2021", "dom"],
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true
  }
}
EOF

RUN cd /home/user/app && \
    cat > src/main.tsx <<'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>,
)
EOF

RUN cd /home/user/app && \
    cat > src/App.tsx <<'EOF'
import './App.css'

function App() {
  return (
    <>
      <h1>Messages</h1>
      {/* Implement paginated query here */}
    </>
  )
}

export default App
EOF

RUN cd /home/user/app && \
    cat > package.json <<'EOF'
{
  "name": "app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "convex": "^1.11.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  }
}
EOF

# Container contents:
#   - React Vite app in /home/user/app
#   - Convex installed and schema defined
#   - Seed script ready
#   - App component ready for implementation

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]
