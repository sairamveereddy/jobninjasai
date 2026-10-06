import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// Ensure the local dev server is running on port 3000
const API_URL = "http://localhost:3000/api/mcp-sync";

// 1. Initialize Server
const server = new Server(
  {
    name: "jobninjas-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 2. Define Tools (Actions)
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "add_agent_to_canvas",
        description: "Adds a new AI Agent to the JobNinjas canvas board. Provide the agent role and coordinates.",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Display name of the agent (e.g., 'Resume Verifier')",
            },
            agentRole: {
              type: "string",
              description: "The internal role id. Can be one of: 'candidate-concierge', 'sourcing-agent', 'resume-verifier', 'tech-assessor', 'culture-fit-interviewer', 'candidate-ranker', 'offer-negotiator', 'onboarding-agent', 'word-doc', 'database-connector', 'gmail-connector'.",
            },
            x: {
              type: "number",
              description: "X coordinate on the canvas (e.g., 100, 300, 500)",
            },
            y: {
              type: "number",
              description: "Y coordinate on the canvas (e.g., 100, 300, 500)",
            }
          },
          required: ["title", "agentRole", "x", "y"],
        },
      },
    ],
  };
});

// 3. Handle Tool Executions
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "add_agent_to_canvas") {
    const { title, agentRole, x, y } = request.params.arguments;

    try {
      // Forward the command to the running Next.js application
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_agent",
          title,
          agentRole,
          x,
          y,
        }),
      });

      if (!res.ok) {
        throw new Error(`API responded with status: ${res.status}`);
      }

      return {
        content: [
          {
            type: "text",
            text: `Successfully added ${title} (${agentRole}) to the canvas at coordinates (${x}, ${y}). The canvas will automatically update within 2 seconds.`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to add agent to canvas. Is the JobNinjas dev server running on port 3000? Error: ${err.message}`,
          },
        ],
      };
    }
  }

  throw new Error("Tool not found");
});

// 4. Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("JobNinjas MCP Server is running via stdio.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
