#!/usr/bin/env node

/**
 * Script sản xuất TVC 60s sử dụng cơ chế Keyframe (Start Frame & End Frame)
 * Quy trình chạy:
 *   Giai đoạn 1: Sinh 12 Start Frames + 12 End Frames dưới dạng ảnh tĩnh (mô hình Gemini) để kiểm soát phong cách tối đa.
 *   Giai đoạn 2: Gọi đồng thời 12 video Veo (truyền cả refImageUrl và refImageEndUrl) + 12 audio thoại.
 *   Giai đoạn 3: Tải về và biên tập tự động bằng FFmpeg.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_URL = 'https://bapi.vidtory.net';
const API_KEY = process.env.VIDTORY_API_KEY;
const CHARACTERS_FILE = '/Users/brianle/Documents/Code/Vidtory/Vidtory-Skill/.agents/skills/vidtory-soul-id/characters.json';
const TMP_DIR = path.join(__dirname, 'tmp_tvc_keyframes');
const OUTPUT_DIR = path.join(__dirname, '..');

if (!API_KEY) {
  console.error('Error: VIDTORY_API_KEY environment variable is not set.');
  process.exit(1);
}

// 1. Storyboard định nghĩa kịch bản chuyển cảnh hai ảnh đầu-cuối
const storyboard = [
  {
    scene: 1,
    duration: 5,
    voicePrompt: "Da khô ráp, sạm đen khiến bạn mất tự tin?",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3", // Ngan
    startFramePrompt: "A close up of a young Asian woman looking at the mirror with a worried expression, soft morning light, photography",
    endFramePrompt: "A close up of the same Asian woman touching her dry cheek with a sad expression, soft indoor lighting",
    transitionPrompt: "The woman slowly turns her head from looking at the mirror towards the camera, emotional facial change, slow motion",
    soulId: "lily"
  },
  {
    scene: 2,
    duration: 5,
    voicePrompt: "Đã có serum dưỡng da GLOW thế hệ mới đột phá.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    startFramePrompt: "A closed white cosmetic cardboard box on a wet stone pedestal, gold embossing, studio lighting",
    endFramePrompt: "A frosted glass serum bottle featuring gold label 'GLOW' standing next to the open box on the pedestal, studio lighting",
    transitionPrompt: "The box smoothly opens to reveal the glowing serum bottle inside, camera panning slowly, realistic physical animation"
  },
  {
    scene: 3,
    duration: 5,
    voicePrompt: "Siêu cấp ẩm tức thì, nuôi dưỡng da từ sâu bên trong.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    startFramePrompt: "A pipette dispensing a drop of clear cosmetic liquid, crystal clear glass reflection",
    endFramePrompt: "Extreme close up of clear serum droplets splashing on smooth glowing skin, water ripples",
    transitionPrompt: "The droplet falls from the pipette and splashes elegantly onto skin surface, creating soft ripples, slow motion"
  },
  {
    scene: 4,
    duration: 5,
    voicePrompt: "Trẻ hóa làn da, làm mờ các nếp nhăn hiệu quả.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    startFramePrompt: "Modern 3D graphic illustration of skin cells before rejuvenation, dried skin layer texture, biotechnology render",
    endFramePrompt: "Modern 3D graphic illustration of glowing skin cells filled with active golden molecules, fully hydrated skin layer, medical render",
    transitionPrompt: "Golden active molecules penetrate skin layers, inflating and illuminating the dried cells, smooth cell transformation animation"
  },
  {
    scene: 5,
    duration: 5,
    voicePrompt: "Cảm giác mát lạnh và thẩm thấu nhanh tức thì.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    startFramePrompt: "A young Asian woman applying serum to her cheek, smiling gently and feeling refreshed, soft natural sun rays",
    endFramePrompt: "The same Asian woman looking at the camera, smiling happily, natural skin texture, bright studio setup",
    transitionPrompt: "The woman slowly strokes her cheek while smiling, feeling the cool liquid absorb, camera zooming out gently",
    soulId: "lily"
  },
  {
    scene: 6,
    duration: 5,
    voicePrompt: "Mang lại làn da căng bóng rạng ngời chỉ sau bảy ngày.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    startFramePrompt: "A close up portrait of a beautiful Asian woman looking at the camera, glowing flawless skin, wind blowing hair",
    endFramePrompt: "The same Asian woman laughing slightly, head tilted back, extremely bright natural outdoor background",
    transitionPrompt: "The woman turns her head and laughs with confidence, soft wind blowing, natural camera pan",
    soulId: "lily"
  },
  {
    scene: 7,
    duration: 5,
    voicePrompt: "Chiết xuất hoàn toàn từ thảo dược tự nhiên dịu nhẹ.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    startFramePrompt: "Green tea leaves on a clear pure water surface, slow motion ripples, studio lighting",
    endFramePrompt: "White rose petals falling gently onto the same water surface next to tea leaves, slow motion ripples",
    transitionPrompt: "Rose petals fall into the water ripples next to tea leaves, splashing tiny water droplets, camera panning down"
  },
  {
    scene: 8,
    duration: 5,
    voicePrompt: "Không gây kích ứng, bảo vệ cả làn da nhạy cảm nhất.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    startFramePrompt: "A pipette close-up with a clear droplet at the tip, soft pastel pink background",
    endFramePrompt: "A drop of clear cosmetic liquid falling onto a smooth glass surface, reflection of light, pastel background",
    transitionPrompt: "The clear cosmetic liquid droplet slowly falls from the pipette onto the glass, smooth gravity simulation"
  },
  {
    scene: 9,
    duration: 5,
    voicePrompt: "Hơn một trăm nghìn phụ nữ tin dùng và lột xác thành công.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    startFramePrompt: "Three smiling Asian women with diverse beautiful skin standing side by side, looking at the camera, confident expressions",
    endFramePrompt: "The same three Asian women cheering and laughing together, turning towards each other, studio setup",
    transitionPrompt: "The women turn towards each other and share a happy laugh, camera panning left to right, cinematic transition"
  },
  {
    scene: 10,
    duration: 5,
    voicePrompt: "Thiết kế chai thủy tinh nhỏ gọn, sang trọng và tiện lợi.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    startFramePrompt: "A frosted glass serum bottle sitting inside a luxury brown leather handbag, soft morning sun rays",
    endFramePrompt: "The same frosted glass serum bottle being pulled out of the leather handbag by a delicate hand",
    transitionPrompt: "A hand gently reaches in and lifts the serum bottle out of the handbag, smooth physical movement, soft lighting"
  },
  {
    scene: 11,
    duration: 5,
    voicePrompt: "Độc quyền giảm giá năm mươi phần trăm chỉ hôm nay.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    startFramePrompt: "A luxury pink cosmetic gift box tied with a satin ribbon sitting on a marble table",
    endFramePrompt: "The same pink gift box opened, ribbon untied, revealing golden sparkles floating out",
    transitionPrompt: "The ribbon unties and the gift box opens smoothly, golden particles and sparkles float into the air"
  },
  {
    scene: 12,
    duration: 5,
    voicePrompt: "Bấm vào giỏ hàng ngay hôm nay để sở hữu làn da không tuổi!",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    startFramePrompt: "A frosted glass serum bottle next to its elegant packaging box, featuring gold label 'GLOW', clean white background",
    endFramePrompt: "Extreme close up of the gold metallic text 'GLOW' on the glass bottle, reflecting studio light",
    transitionPrompt: "The camera zooms in dynamically from the bottle view to the extreme close up of the shiny gold logo text 'GLOW'"
  }
];

function readCharacters() {
  if (fs.existsSync(CHARACTERS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CHARACTERS_FILE, 'utf8'));
    } catch (e) {
      return {};
    }
  }
  return {};
}

// Gọi API sinh Ảnh
async function requestImage(prompt, ratio) {
  const body = {
    prompt: prompt,
    modelId: 'gemini-3.1-flash-image-preview',
    aspectRatio: ratio || 'IMAGE_ASPECT_RATIO_PORTRAIT' // 9:16 tương ứng cho video portrait
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
    throw new Error(`Image generation request failed: ${text}`);
  }
  const json = await res.json();
  return json.data.generationHistoryId;
}

// Gọi API sinh Audio
async function requestAudio(scene) {
  const body = {
    prompt: scene.voicePrompt,
    modelId: 'eleven_v3',
    voiceId: scene.voiceId
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
    throw new Error(`Audio request failed: ${text}`);
  }
  const json = await res.json();
  return json.data.generationHistoryId;
}

// Gọi API sinh Video từ Start và End Frames
async function requestVideoWithFrames(scene, startUrl, endUrl, chars) {
  let prompt = scene.transitionPrompt;
  let sampleCharacterUrl = undefined;

  if (scene.soulId && chars[scene.soulId]) {
    const char = chars[scene.soulId];
    prompt = `${prompt}, ${char.prompt}`;
    sampleCharacterUrl = char.image;
  }

  const body = {
    prompt: prompt,
    modelId: 'veo-3.1-fast-generate-001',
    aspectRatio: 'VIDEO_ASPECT_RATIO_PORTRAIT',
    duration: scene.duration,
    refImageUrl: startUrl,
    refImageEndUrl: endUrl,
    ...(sampleCharacterUrl && { sampleCharacterUrl })
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
    throw new Error(`Video generation request failed: ${text}`);
  }
  const json = await res.json();
  return json.data.generationHistoryId;
}

// Kiểm tra trạng thái Job
async function getJobStatus(jobId) {
  const res = await fetch(`${BASE_URL}/generative-core/jobs/${jobId}/status`, {
    headers: {
      'x-api-key': API_KEY
    }
  });
  if (!res.ok) return { status: 'ERROR' };
  const json = await res.json();
  return json.data;
}

// Tải file
async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
}

// Polling Helper
async function pollJobsConcurrently(jobsList) {
  const pending = [...jobsList];
  const completedUrls = {};

  while (pending.length > 0) {
    process.stdout.write(`Đang xử lý: ${pending.length} jobs còn lại...\r`);
    for (let i = pending.length - 1; i >= 0; i--) {
      const job = pending[i];
      try {
        const data = await getJobStatus(job.jobId);
        if (data.status === 'COMPLETED') {
          completedUrls[job.key] = data.result.url;
          pending.splice(i, 1);
          console.log(` -> Job [${job.key}] hoàn tất! URL: ${data.result.url}`);
        } else if (data.status === 'FAILED') {
          throw new Error(`Server failed job: ${data.error || 'Unknown error'}`);
        }
      } catch (err) {
        console.error(`\nLỗi ở Job [${job.key}]: ${err.message}. Sẽ thử lại.`);
      }
    }
    if (pending.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  return completedUrls;
}

async function main() {
  console.log('=== KHỞI ĐỘNG PIPELINE TVC 60s HỆ KEYFRAME NÂNG CAO ===');
  if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR, { recursive: true });
  }

  const chars = readCharacters();

  // ==========================================
  // GIAI ĐOẠN 1: Sinh đồng thời 24 Ảnh Keyframe (12 Start + 12 End)
  // ==========================================
  console.log('\n[Giai đoạn 1/4] Gửi 24 yêu cầu sinh Keyframe (Start/End Image) song song...');
  const keyframeJobs = [];
  
  for (const scene of storyboard) {
    let startPrompt = scene.startFramePrompt;
    let endPrompt = scene.endFramePrompt;

    if (scene.soulId && chars[scene.soulId]) {
      const char = chars[scene.soulId];
      startPrompt = `${startPrompt}, ${char.prompt}`;
      endPrompt = `${endPrompt}, ${char.prompt}`;
    }

    const startPromise = requestImage(startPrompt, 'IMAGE_ASPECT_RATIO_PORTRAIT')
      .then(jobId => ({ key: `${scene.scene}_start_img`, jobId }));
    const endPromise = requestImage(endPrompt, 'IMAGE_ASPECT_RATIO_PORTRAIT')
      .then(jobId => ({ key: `${scene.scene}_end_img`, jobId }));
      
    keyframeJobs.push(startPromise, endPromise);
  }

  const registeredKeyframes = await Promise.all(keyframeJobs);
  console.log('Đã đăng ký 24 job sinh ảnh keyframe đầu/cuối.');
  const keyframeUrls = await pollJobsConcurrently(registeredKeyframes);
  console.log('\nTất cả 24 ảnh Keyframes đã hoàn tất!');

  // ==========================================
  // GIAI ĐOẠN 2: Sinh đồng thời 24 Video & Audio
  // ==========================================
  console.log('\n[Giai đoạn 2/4] Gửi 24 yêu cầu sinh Video (Nối Keyframe) & Audio song song...');
  const prodJobs = [];

  for (const scene of storyboard) {
    const startUrl = keyframeUrls[`${scene.scene}_start_img`];
    const endUrl = keyframeUrls[`${scene.scene}_end_img`];

    const audioPromise = requestAudio(scene)
      .then(jobId => ({ key: `${scene.scene}_audio`, jobId }));
    const videoPromise = requestVideoWithFrames(scene, startUrl, endUrl, chars)
      .then(jobId => ({ key: `${scene.scene}_video`, jobId }));

    prodJobs.push(audioPromise, videoPromise);
  }

  const registeredProds = await Promise.all(prodJobs);
  console.log('Đã đăng ký 24 job sinh video & audio thoại.');
  const prodUrls = await pollJobsConcurrently(registeredProds);
  console.log('\nTất cả video và audio phân cảnh đã hoàn tất!');

  // ==========================================
  // GIAI ĐOẠN 3: Tải tài nguyên về thư mục tạm
  // ==========================================
  console.log('\n[Giai đoạn 3/4] Tải tài nguyên về máy cục bộ...');
  for (const scene of storyboard) {
    const audioUrl = prodUrls[`${scene.scene}_audio`];
    const videoUrl = prodUrls[`${scene.scene}_video`];

    const audioPath = path.join(TMP_DIR, `scene_${scene.scene}.mp3`);
    const videoPath = path.join(TMP_DIR, `scene_${scene.scene}.mp4`);

    console.log(`Tải Scene ${scene.scene}...`);
    await downloadFile(audioUrl, audioPath);
    await downloadFile(videoUrl, videoPath);
  }

  // Tải nhạc nền ambient
  const bgmPath = path.join(TMP_DIR, 'bgm.mp3');
  const bgmUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';
  console.log('Tải nhạc nền BGM...');
  try {
    await downloadFile(bgmUrl, bgmPath);
    console.log('Tải nhạc nền thành công.');
  } catch (e) {
    console.warn('Không tải được nhạc nền BGM.');
  }

  // ==========================================
  // GIAI ĐOẠN 4: Ghép nối tự động bằng FFmpeg
  // ==========================================
  console.log('\n[Giai đoạn 4/4] Ghép nối và biên tập bằng FFmpeg...');

  // A. Ghép audio + video từng cảnh
  for (const scene of storyboard) {
    const vPath = path.join(TMP_DIR, `scene_${scene.scene}.mp4`);
    const aPath = path.join(TMP_DIR, `scene_${scene.scene}.mp3`);
    const outPath = path.join(TMP_DIR, `scene_${scene.scene}_mux.mp4`);

    const cmd = `ffmpeg -y -i "${vPath}" -i "${aPath}" -c:v copy -c:a aac -shortest -map 0:v:0 -map 1:a:0 "${outPath}"`;
    execSync(cmd, { stdio: 'ignore' });
  }

  // B. Tạo file list
  const listFilePath = path.join(TMP_DIR, 'concat_list.txt');
  let listContent = '';
  for (const scene of storyboard) {
    listContent += `file 'scene_${scene.scene}_mux.mp4'\n`;
  }
  fs.writeFileSync(listFilePath, listContent, 'utf8');

  // C. Ghép chuỗi cảnh
  const mergedNoBgmPath = path.join(TMP_DIR, 'tvc_no_bgm.mp4');
  const concatCmd = `ffmpeg -y -f concat -safe 0 -i "${listFilePath}" -c copy "${mergedNoBgmPath}"`;
  execSync(concatCmd, { stdio: 'ignore' });

  // D. Trộn nhạc nền
  const finalOutPath = path.join(OUTPUT_DIR, 'tvc_glow_60s_keyframes_completed.mp4');
  if (fs.existsSync(bgmPath)) {
    console.log(' - Lồng nhạc nền và trộn âm thoại thuyết minh...');
    const mixCmd = `ffmpeg -y -i "${mergedNoBgmPath}" -i "${bgmPath}" -filter_complex "[0:a]volume=1.0[a1];[1:a]volume=0.12[a2];[a1][a2]amix=inputs=2:duration=first" -c:v copy -c:a aac "${finalOutPath}"`;
    execSync(mixCmd, { stdio: 'ignore' });
  } else {
    fs.copyFileSync(mergedNoBgmPath, finalOutPath);
  }

  console.log(`\n=== TVC KEYFRAME HOÀN TẤT THÀNH CÔNG! ===`);
  console.log(`Video TVC cao cấp lưu tại: file://${finalOutPath}`);

  // Dọn dẹp
  try {
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
  } catch (e) {}
}

main().catch(err => {
  console.error(`Pipeline keyframe failed: ${err.message}`);
  process.exit(1);
});
