#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://bapi.vidtory.net';
const API_KEY = process.env.VIDTORY_API_KEY;

if (!API_KEY) {
  console.error('Error: VIDTORY_API_KEY environment variable is not set.');
  process.exit(1);
}

// Map aspect ratios
const IMAGE_RATIO_MAP = {
  '1:1': 'IMAGE_ASPECT_RATIO_SQUARE',
  '16:9': 'IMAGE_ASPECT_RATIO_LANDSCAPE',
  '9:16': 'IMAGE_ASPECT_RATIO_PORTRAIT',
  '3:4': 'IMAGE_ASPECT_RATIO_PORTRAIT_THREE_FOUR',
  '4:3': 'IMAGE_ASPECT_RATIO_LANDSCAPE_FOUR_THREE'
};

const VIDEO_RATIO_MAP = {
  '16:9': 'VIDEO_ASPECT_RATIO_LANDSCAPE',
  '9:16': 'VIDEO_ASPECT_RATIO_PORTRAIT'
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.mp4') return 'video/mp4';
  if (ext === '.mov') return 'video/quicktime';
  return 'application/octet-stream';
}

function isLocalFile(val) {
  if (typeof val !== 'string') return false;
  try {
    return fs.existsSync(val) && fs.lstatSync(val).isFile();
  } catch (e) {
    return false;
  }
}

// Upload file helper
async function uploadMedia(filePath, preserveFormat = false) {
  const fileBuffer = fs.readFileSync(filePath);
  const fileBlob = new Blob([fileBuffer], { type: getMimeType(filePath) });
  const formData = new FormData();
  formData.append('file', fileBlob, path.basename(filePath));

  let url = `${BASE_URL}/media/upload`;
  if (preserveFormat) {
    url += '?preserveFormat=true';
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY
    },
    body: formData
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  return json; // returns MediaResponseDto { id, url, ... }
}

// Get job status helper
async function getJobStatus(jobId) {
  const res = await fetch(`${BASE_URL}/generative-core/jobs/${jobId}/status`, {
    headers: {
      'x-api-key': API_KEY
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to get job status (${res.status}): ${text}`);
  }

  return await res.json();
}

// Poll job status until complete
async function pollJob(jobId, intervalMs = 3000) {
  process.stdout.write(`Polling job ${jobId}...`);
  while (true) {
    try {
      const statusRes = await getJobStatus(jobId);
      // Expected payload format: { success, data: { status, result: { url } } }
      const jobData = statusRes.data;
      const status = jobData.status;
      
      if (status === 'COMPLETED') {
        console.log(' Completed!');
        return jobData.result.url;
      } else if (status === 'FAILED') {
        console.log(' Failed!');
        throw new Error(jobData.error || 'Job failed on server');
      } else {
        process.stdout.write('.');
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    } catch (err) {
      console.log(' Error!');
      throw err;
    }
  }
}

// Parse custom command arguments
function parseArgs(args) {
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const val = args[i + 1];
      if (val && !val.startsWith('--')) {
        options[key] = val;
        i++;
      } else {
        options[key] = true;
      }
    }
  }
  return options;
}

// Resolve any local file argument to a Vidtory BAPI Media ID / URL
async function resolveMediaArg(val) {
  if (isLocalFile(val)) {
    console.log(`Auto-uploading local file: ${val}...`);
    const uploadRes = await uploadMedia(val);
    const mediaId = uploadRes.data.id;
    const mediaUrl = uploadRes.data.url;
    console.log(`Uploaded! ID: ${mediaId}, URL: ${mediaUrl}`);
    return mediaUrl; // We use URL as it's highly supported
  }
  return val;
}

const CHARACTERS_FILE = path.join(__dirname, 'vidtory-soul-id', 'characters.json');

function readCharacters() {
  if (!fs.existsSync(CHARACTERS_FILE)) {
    fs.mkdirSync(path.dirname(CHARACTERS_FILE), { recursive: true });
    fs.writeFileSync(CHARACTERS_FILE, '{}', 'utf8');
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(CHARACTERS_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

function writeCharacters(data) {
  fs.mkdirSync(path.dirname(CHARACTERS_FILE), { recursive: true });
  fs.writeFileSync(CHARACTERS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

async function resolveSoulId(soulId, options) {
  if (!soulId) return;
  const chars = readCharacters();
  const char = chars[soulId];
  if (!char) {
    throw new Error(`Character (soul-id) '${soulId}' not found in local characters.json`);
  }
  console.log(`Resolved soul-id '${soulId}': adding description to prompt and using ref image.`);
  options.prompt = `${options.prompt}, ${char.prompt}`;
  options.sampleCharacterUrl = char.image;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log('Vidtory BAPI CLI wrapper');
    console.log('Usage:');
    console.log('  vidtory-cli upload --file <path> [--preserveFormat]');
    console.log('  vidtory-cli generate-image --prompt <prompt> [--aspectRatio <ratio>] [--refImageUrl <path_or_url>] [--sampleCharacterUrl <path_or_url>] [--styleImageUrl <path_or_url>] [--resolution <1K|2K|4K>] [--soulId <character_name>]');
    console.log('  vidtory-cli generate-video --prompt <prompt> [--aspectRatio <ratio>] [--duration <seconds>] [--refImageUrl <path_or_url>] [--refImageEndUrl <path_or_url>] [--sampleCharacterUrl <path_or_url>] [--styleImageUrl <path_or_url>] [--soulId <character_name>]');
    console.log('  vidtory-cli generate-audio --prompt <prompt> [--voiceId <id>] [--speed <speed>]');
    console.log('  vidtory-cli voices-list [--language <lang>]');
    console.log('  vidtory-cli character-create --name <name> --image <path_or_url> --prompt <description>');
    console.log('  vidtory-cli character-list');
    console.log('  vidtory-cli character-get --name <name>');
    console.log('  vidtory-cli status --id <id>');
    process.exit(0);
  }

  const options = parseArgs(args.slice(1));

  try {
    if (command === 'upload') {
      if (!options.file) {
        console.error('Error: --file parameter is required');
        process.exit(1);
      }
      const res = await uploadMedia(options.file, !!options.preserveFormat);
      console.log(JSON.stringify(res, null, 2));
    } 
    
    else if (command === 'generate-image') {
      if (!options.prompt) {
        console.error('Error: --prompt parameter is required');
        process.exit(1);
      }

      // Check for soulId mapping
      if (options.soulId) {
        await resolveSoulId(options.soulId, options);
      }

      // Resolve local media paths
      if (options.refImageUrl) options.refImageUrl = await resolveMediaArg(options.refImageUrl);
      if (options.sampleCharacterUrl) options.sampleCharacterUrl = await resolveMediaArg(options.sampleCharacterUrl);
      if (options.styleImageUrl) options.styleImageUrl = await resolveMediaArg(options.styleImageUrl);

      const mappedRatio = IMAGE_RATIO_MAP[options.aspectRatio] || options.aspectRatio;

      const body = {
        prompt: options.prompt,
        modelId: 'gemini-3.1-flash-image-preview',
        ...(mappedRatio && { aspectRatio: mappedRatio }),
        ...(options.refImageUrl && { refImageUrl: options.refImageUrl }),
        ...(options.sampleCharacterUrl && { sampleCharacterUrl: options.sampleCharacterUrl }),
        ...(options.styleImageUrl && { styleImageUrl: options.styleImageUrl }),
        ...(options.resolution && { resolution: options.resolution })
      };

      const res = await fetch(`${BASE_URL}/generative-core/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Generation failed (${res.status}): ${text}`);
      }

      const json = await res.json();
      const jobId = json.data.generationHistoryId;
      console.log(`Image generation initiated. Job ID: ${jobId}`);

      const resultUrl = await pollJob(jobId);
      console.log(`\nGenerated Image URL: ${resultUrl}`);
    } 
    
    else if (command === 'generate-video') {
      if (!options.prompt) {
        console.error('Error: --prompt parameter is required');
        process.exit(1);
      }

      // Check for soulId mapping
      if (options.soulId) {
        await resolveSoulId(options.soulId, options);
      }

      // Resolve local media paths
      if (options.refImageUrl) options.refImageUrl = await resolveMediaArg(options.refImageUrl);
      if (options.refImageEndUrl) options.refImageEndUrl = await resolveMediaArg(options.refImageEndUrl);
      if (options.sampleCharacterUrl) options.sampleCharacterUrl = await resolveMediaArg(options.sampleCharacterUrl);
      if (options.styleImageUrl) options.styleImageUrl = await resolveMediaArg(options.styleImageUrl);

      const mappedRatio = VIDEO_RATIO_MAP[options.aspectRatio] || options.aspectRatio;
      const durationNum = options.duration ? parseInt(options.duration, 10) : undefined;

      const body = {
        prompt: options.prompt,
        modelId: 'veo-3.1-fast-generate-001',
        ...(mappedRatio && { aspectRatio: mappedRatio }),
        ...(durationNum && { duration: durationNum }),
        ...(options.refImageUrl && { refImageUrl: options.refImageUrl }),
        ...(options.refImageEndUrl && { refImageEndUrl: options.refImageEndUrl }),
        ...(options.sampleCharacterUrl && { sampleCharacterUrl: options.sampleCharacterUrl }),
        ...(options.styleImageUrl && { styleImageUrl: options.styleImageUrl })
      };

      const res = await fetch(`${BASE_URL}/generative-core/video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Generation failed (${res.status}): ${text}`);
      }

      const json = await res.json();
      const jobId = json.data.generationHistoryId;
      console.log(`Video generation initiated. Job ID: ${jobId}`);

      const resultUrl = await pollJob(jobId);
      console.log(`\nGenerated Video URL: ${resultUrl}`);
    } 
    
    else if (command === 'character-create') {
      if (!options.name || !options.image || !options.prompt) {
        console.error('Error: --name, --image, and --prompt are all required');
        process.exit(1);
      }

      const resolvedImage = await resolveMediaArg(options.image);
      const chars = readCharacters();
      chars[options.name] = {
        name: options.name,
        image: resolvedImage,
        prompt: options.prompt,
        createdAt: new Date().toISOString()
      };
      writeCharacters(chars);
      console.log(`Character '${options.name}' saved successfully in characters.json.`);
    }

    else if (command === 'character-list') {
      const chars = readCharacters();
      console.log(JSON.stringify(chars, null, 2));
    }

    else if (command === 'character-get') {
      if (!options.name) {
        console.error('Error: --name parameter is required');
        process.exit(1);
      }
      const chars = readCharacters();
      const char = chars[options.name];
      if (!char) {
        console.error(`Character '${options.name}' not found.`);
        process.exit(1);
      }
      console.log(JSON.stringify(char, null, 2));
    }

    else if (command === 'generate-audio') {
      if (!options.prompt) {
        console.error('Error: --prompt parameter is required');
        process.exit(1);
      }
      const body = {
        prompt: options.prompt,
        modelId: 'eleven_v3',
        ...(options.voiceId && { voiceId: options.voiceId }),
        ...(options.speed && { speed: parseFloat(options.speed) })
      };
      const res = await fetch(`${BASE_URL}/generative-core/audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Audio generation failed (${res.status}): ${text}`);
      }
      const json = await res.json();
      const jobId = json.data.generationHistoryId;
      console.log(`Audio generation initiated. Job ID: ${jobId}`);
      const resultUrl = await pollJob(jobId);
      console.log(`\nGenerated Audio URL: ${resultUrl}`);
    }

    else if (command === 'voices-list') {
      let url = `${BASE_URL}/voices`;
      if (options.language) {
        url += `?language=${options.language}`;
      }
      const res = await fetch(url, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to list voices (${res.status}): ${text}`);
      }
      const json = await res.json();
      console.log(JSON.stringify(json.data, null, 2));
    }

    else if (command === 'status') {
      if (!options.id) {
        console.error('Error: --id parameter is required');
        process.exit(1);
      }
      const res = await getJobStatus(options.id);
      console.log(JSON.stringify(res, null, 2));
    } 
    
    else {
      console.error(`Unknown command: ${command}`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
