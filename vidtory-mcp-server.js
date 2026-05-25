#!/usr/bin/env node

/**
 * Model Context Protocol (MCP) Server for Vidtory BAPI
 * Hoạt động trên giao thức JSON-RPC 2.0 stdio (zero dependencies)
 * Hỗ trợ tích hợp làm Native Tools cho các AI client (Cursor, Windsurf, Claude Desktop, v.v.)
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const TOOLS = [
  {
    "name": "generate_image",
    "description": "Generate high-fidelity advertising, packaging, or brand visuals using Vidtory BAPI (gemini-3.1-flash-image-preview).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "prompt": {
          "type": "string",
          "description": "Detailed text prompt describing the image concept, style, colors, and layout."
        },
        "aspectRatio": {
          "type": "string",
          "enum": ["1:1", "16:9", "9:16", "3:4", "4:3"],
          "description": "Image aspect ratio. Defaults to 1:1."
        },
        "refImageUrl": {
          "type": "string",
          "description": "Local file path or URL of reference image to preserve structure/content."
        },
        "soulId": {
          "type": "string",
          "description": "Local character name (e.g. model_asian_lily) to preserve face consistency."
        },
        "resolution": {
          "type": "string",
          "enum": ["1K", "2K", "4K"],
          "description": "Output resolution quality level."
        }
      },
      "required": ["prompt"]
    }
  },
  {
    "name": "generate_video",
    "description": "Generate dynamic unboxing, fashion catwalk, or transition advertising videos via Vidtory BAPI (veo-3.1-fast-generate-001).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "prompt": {
          "type": "string",
          "description": "Detailed physical motion and descriptive prompt for the video."
        },
        "aspectRatio": {
          "type": "string",
          "enum": ["16:9", "9:16"],
          "description": "Video aspect ratio. Defaults to 9:16."
        },
        "duration": {
          "type": "integer",
          "description": "Video duration in seconds. Max 5 seconds. Defaults to 5."
        },
        "refImageUrl": {
          "type": "string",
          "description": "Local file path or URL of the start keyframe reference image."
        },
        "refImageEndUrl": {
          "type": "string",
          "description": "Local file path or URL of the end keyframe reference image to interpolate between."
        },
        "soulId": {
          "type": "string",
          "description": "Local character name (e.g. model_asian_lily) to preserve face consistency."
        }
      },
      "required": ["prompt"]
    }
  },
  {
    "name": "generate_audio",
    "description": "Synthesize natural text-to-speech (TTS) voiceover using Vidtory BAPI (eleven_v3), optimized for Vietnamese and English.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "prompt": {
          "type": "string",
          "description": "Text script to read out. For Vietnamese, speed is estimated at 2.5 words per second."
        },
        "voiceId": {
          "type": "string",
          "description": "ElevenLabs voice ID (e.g. Ngan: a3AkyqGG4v8Pg7SWQ0Y3, Tuan: 9EE00wK5qV6tPtpQIxvy)."
        },
        "speed": {
          "type": "number",
          "description": "Reading speed multiplier. Defaults to 1.0."
        }
      },
      "required": ["prompt"]
    }
  },
  {
    "name": "voices_list",
    "description": "List all supported voiceover actors and speakers on Vidtory BAPI, filtered by language.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string",
          "description": "Two-letter language code (e.g., 'vi' for Vietnamese, 'en' for English)."
        }
      }
    }
  },
  {
    "name": "character_create",
    "description": "Register and save a new AI character model locally to be used for Face-ID consistency with soulId.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Unique identifier name for the character (e.g., 'lily')."
        },
        "image": {
          "type": "string",
          "description": "Local file path or URL of the high-quality portrait reference image."
        },
        "prompt": {
          "type": "string",
          "description": "Descriptive text representing the physical appearance of the model."
        }
      },
      "required": ["name", "image", "prompt"]
    }
  },
  {
    "name": "character_list",
    "description": "List all locally registered character models saved in the database.",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  }
];

const CLI_PATH = path.join(__dirname, '.agents', 'skills', 'vidtory-cli.js');

function sendResponse(response) {
  process.stdout.write(JSON.stringify(response) + '\n');
}

function handleNotification(message) {
  // Notifications do not require responses
  if (message.method === 'notifications/initialized') {
    // console.error('MCP Client initialized successfully.');
  }
}

function executeTool(name, argumentsObj) {
  const cliCommands = {
    'generate_image': 'generate-image',
    'generate_video': 'generate-video',
    'generate_audio': 'generate-audio',
    'voices_list': 'voices-list',
    'character_create': 'character-create',
    'character_list': 'character-list'
  };

  const command = cliCommands[name];
  if (!command) {
    throw new Error(`Tool name '${name}' not mapped to CLI command.`);
  }

  const execArgs = [CLI_PATH, command];
  for (const [key, val] of Object.entries(argumentsObj)) {
    if (val !== undefined && val !== null) {
      execArgs.push(`--${key}`, String(val));
    }
  }

  // Run subprocess to call the CLI wrapper
  const stdout = execFileSync(process.execPath, execArgs, {
    env: { ...process.env },
    encoding: 'utf8'
  });
  return stdout;
}

function handleRequest(message) {
  const { id, method, params } = message;

  if (method === 'initialize') {
    return sendResponse({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: "vidtory-mcp-server",
          version: "1.0.0"
        }
      }
    });
  }

  if (method === 'tools/list') {
    return sendResponse({
      jsonrpc: "2.0",
      id,
      result: {
        tools: TOOLS
      }
    });
  }

  if (method === 'tools/call') {
    const { name, arguments: args } = params;
    try {
      const output = executeTool(name, args || {});
      return sendResponse({
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: output
            }
          ]
        }
      });
    } catch (err) {
      return sendResponse({
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: `Error executing tool '${name}': ${err.message}`
            }
          ],
          isError: true
        }
      });
    }
  }

  // Fallback for unsupported methods
  return sendResponse({
    jsonrpc: "2.0",
    id,
    error: {
      code: -32601,
      message: `Method not found: ${method}`
    }
  });
}

// Read stdin line by line
let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buffer += chunk;
  let newlineIndex;
  while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, newlineIndex).trim();
    buffer = buffer.slice(newlineIndex + 1);
    if (line) {
      try {
        const message = JSON.parse(line);
        if (message.id !== undefined) {
          handleRequest(message);
        } else {
          handleNotification(message);
        }
      } catch (err) {
        sendResponse({
          jsonrpc: "2.0",
          id: null,
          error: {
            code: -32700,
            message: `Parse error: ${err.message}`
          }
        });
      }
    }
  }
});

// Write ready signal to stderr for debugging/logging
// console.error('Vidtory MCP Stdio Server running...');
