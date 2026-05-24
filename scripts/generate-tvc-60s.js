#!/usr/bin/env node

/**
 * Script sản xuất tự động TVC 60s cho Serum dưỡng da GLOW
 * Sử dụng song song 12 Phân cảnh Video (Veo) và 12 Phân cảnh Audio (ElevenLabs)
 * Ghép nối tự động và lồng nhạc nền bằng FFmpeg.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_URL = 'https://bapi.vidtory.net';
const API_KEY = process.env.VIDTORY_API_KEY;
const CHARACTERS_FILE = '/Users/brianle/Documents/Code/Vidtory/Vidtory-Skill/.agents/skills/vidtory-soul-id/characters.json';
const TMP_DIR = path.join(__dirname, 'tmp_tvc');
const OUTPUT_DIR = __dirname;

if (!API_KEY) {
  console.error('Error: VIDTORY_API_KEY environment variable is not set.');
  process.exit(1);
}

// 1. Định nghĩa Storyboard 60s (12 Cảnh x 5 giây)
const storyboard = [
  {
    scene: 1,
    duration: 5,
    voicePrompt: "Da khô ráp, sạm đen khiến bạn mất tự tin?",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3", // Ngan (Bubbly & Authentic)
    videoPrompt: "A close up of a young Asian woman looking at the mirror with a worried expression, soft morning light, slow motion",
    soulId: "lily"
  },
  {
    scene: 2,
    duration: 5,
    voicePrompt: "Đã có serum dưỡng da GLOW thế hệ mới đột phá.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    videoPrompt: "A frosted glass serum bottle featuring gold label 'GLOW' standing on a wet stone pedestal, soft white background, studio lighting"
  },
  {
    scene: 3,
    duration: 5,
    voicePrompt: "Siêu cấp ẩm tức thì, nuôi dưỡng da từ sâu bên trong.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    videoPrompt: "Extreme close up of clear serum droplets splashing on smooth glowing skin, water ripples, slow motion"
  },
  {
    scene: 4,
    duration: 5,
    voicePrompt: "Trẻ hóa làn da, làm mờ các nếp nhăn hiệu quả.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    videoPrompt: "Modern 3D graphic illustration of golden active molecules penetrating skin layers, abstract biotechnology style, medical render"
  },
  {
    scene: 5,
    duration: 5,
    voicePrompt: "Cảm giác mát lạnh và thẩm thấu nhanh tức thì.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    videoPrompt: "A young Asian woman applying serum to her cheek, smiling gently and feeling refreshed, soft natural sun rays",
    soulId: "lily"
  },
  {
    scene: 6,
    duration: 5,
    voicePrompt: "Mang lại làn da căng bóng rạng ngời chỉ sau bảy ngày.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    videoPrompt: "A close up of a beautiful Asian woman smiling at the camera, glowing flawless skin, soft wind blowing her hair",
    soulId: "lily"
  },
  {
    scene: 7,
    duration: 5,
    voicePrompt: "Chiết xuất hoàn toàn từ thảo dược tự nhiên dịu nhẹ.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    videoPrompt: "Green tea leaves and white rose petals falling gently onto clean pure water surface, slow motion ripples"
  },
  {
    scene: 8,
    duration: 5,
    voicePrompt: "Không gây kích ứng, bảo vệ cả làn da nhạy cảm nhất.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    videoPrompt: "A pipette dispensing a drop of clear cosmetic liquid, crystal clear glass reflection, soft pastel pink background"
  },
  {
    scene: 9,
    duration: 5,
    voicePrompt: "Hơn một trăm nghìn phụ nữ tin dùng và lột xác thành công.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    videoPrompt: "Three smiling Asian women with diverse beautiful skin standing side by side, looking at the camera, confident expressions"
  },
  {
    scene: 10,
    duration: 5,
    voicePrompt: "Thiết kế chai thủy tinh nhỏ gọn, sang trọng và tiện lợi.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    videoPrompt: "A frosted glass serum bottle sitting inside a luxury leather handbag, Quiet Luxury style, soft morning sun rays"
  },
  {
    scene: 11,
    duration: 5,
    voicePrompt: "Độc quyền giảm giá năm mươi phần trăm chỉ hôm nay.",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    videoPrompt: "A luxury pink cosmetic gift box tied with a satin ribbon being opened, golden sparkles floating around"
  },
  {
    scene: 12,
    duration: 5,
    voicePrompt: "Bấm vào giỏ hàng ngay hôm nay để sở hữu làn da không tuổi!",
    voiceId: "a3AkyqGG4v8Pg7SWQ0Y3",
    videoPrompt: "A frosted glass serum bottle next to its elegant packaging box, featuring gold label 'GLOW', clean white background, studio light"
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
    throw new Error(`Audio Scene ${scene.scene} failed: ${text}`);
  }
  const json = await res.json();
  return json.data.generationHistoryId;
}

// Gọi API sinh Video
async function requestVideo(scene, chars) {
  let prompt = scene.videoPrompt;
  let sampleCharacterUrl = undefined;

  if (scene.soulId && chars[scene.soulId]) {
    const char = chars[scene.soulId];
    prompt = `${prompt}, ${char.prompt}`;
    sampleCharacterUrl = char.image;
  }

  const body = {
    prompt: prompt,
    modelId: 'veo-3.1-fast-generate-001',
    aspectRatio: 'VIDEO_ASPECT_RATIO_PORTRAIT', // 9:16 cho short ads
    duration: scene.duration,
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
    throw new Error(`Video Scene ${scene.scene} failed: ${text}`);
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

// Tải file về cục bộ
async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
}

async function main() {
  console.log('--- KHỞI ĐỘNG PIPELINE SẢN XUẤT TVC 60s TỰ ĐỘNG ---');
  if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR, { recursive: true });
  }

  const chars = readCharacters();
  const jobs = [];

  // Bước 1: Gọi đồng thời 24 API requests (12 audio, 12 video)
  console.log('\n[1/4] Gửi 24 yêu cầu sinh Audio & Video song song (Token Burning)...');
  for (const scene of storyboard) {
    const audioPromise = requestAudio(scene).then(jobId => ({ scene: scene.scene, type: 'audio', jobId }));
    const videoPromise = requestVideo(scene, chars).then(jobId => ({ scene: scene.scene, type: 'video', jobId }));
    jobs.push(audioPromise, videoPromise);
  }

  const registeredJobs = await Promise.all(jobs);
  console.log(`Đã đăng ký thành công 24 Jobs trong nền.`);

  // Bước 2: Polling song song trạng thái các Job
  console.log('\n[2/4] Bắt đầu polling song song trạng thái các Job...');
  const pendingJobs = [...registeredJobs];
  const completedUrls = {};

  while (pendingJobs.length > 0) {
    process.stdout.write(`Đang xử lý: ${pendingJobs.length} jobs còn lại...\r`);
    for (let i = pendingJobs.length - 1; i >= 0; i--) {
      const job = pendingJobs[i];
      try {
        const data = await getJobStatus(job.jobId);
        if (data.status === 'COMPLETED') {
          completedUrls[`${job.scene}_${job.type}`] = data.result.url;
          pendingJobs.splice(i, 1);
          console.log(` -> Scene ${job.scene} ${job.type.toUpperCase()} hoàn tất! URL: ${data.result.url}`);
        } else if (data.status === 'FAILED') {
          throw new Error(`Server failed job: ${data.error || 'Unknown error'}`);
        }
      } catch (err) {
        console.error(`\nLỗi ở Scene ${job.scene} ${job.type}: ${err.message}. Sẽ thử lại.`);
      }
    }
    if (pendingJobs.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log('\nTất cả 24 Jobs đã sinh hoàn tất thành công!');

  // Bước 3: Tải tài nguyên về thư mục tạm
  console.log('\n[3/4] Tải âm thanh và video cảnh lẻ về máy...');
  for (const scene of storyboard) {
    const audioUrl = completedUrls[`${scene.scene}_audio`];
    const videoUrl = completedUrls[`${scene.scene}_video`];

    const audioPath = path.join(TMP_DIR, `scene_${scene.scene}.mp3`);
    const videoPath = path.join(TMP_DIR, `scene_${scene.scene}.mp4`);

    console.log(`Tải Scene ${scene.scene}...`);
    await downloadFile(audioUrl, audioPath);
    await downloadFile(videoUrl, videoPath);
  }

  // Tải nhạc nền ambient
  const bgmPath = path.join(TMP_DIR, 'bgm.mp3');
  const bgmUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'; // Free royalty-free BGM
  console.log('Tải nhạc nền BGM...');
  try {
    await downloadFile(bgmUrl, bgmPath);
    console.log('Tải nhạc nền thành công.');
  } catch (e) {
    console.warn('Không tải được nhạc nền, TVC sẽ chỉ chứa giọng thoại thuyết minh.');
  }

  // Bước 4: Muxing & Concatenating bằng FFmpeg
  console.log('\n[4/4] Biên tập ghép nối tự động bằng FFmpeg...');
  
  // A. Ghép tiếng và hình cho từng phân cảnh
  console.log(' - Muxing audio + video cho từng cảnh...');
  for (const scene of storyboard) {
    const vPath = path.join(TMP_DIR, `scene_${scene.scene}.mp4`);
    const aPath = path.join(TMP_DIR, `scene_${scene.scene}.mp3`);
    const outPath = path.join(TMP_DIR, `scene_${scene.scene}_mux.mp4`);

    // Ghép audio và video, đồng bộ độ dài của video theo audio (hoặc ngược lại)
    const cmd = `ffmpeg -y -i "${vPath}" -i "${aPath}" -c:v copy -c:a aac -shortest -map 0:v:0 -map 1:a:0 "${outPath}"`;
    execSync(cmd, { stdio: 'ignore' });
  }

  // B. Tạo file danh sách ghép nối
  const listFilePath = path.join(TMP_DIR, 'concat_list.txt');
  let listContent = '';
  for (const scene of storyboard) {
    listContent += `file 'scene_${scene.scene}_mux.mp4'\n`;
  }
  fs.writeFileSync(listFilePath, listContent, 'utf8');

  // C. Ghép nối 12 cảnh thành video TVC 60s không nhạc nền
  const mergedNoBgmPath = path.join(TMP_DIR, 'tvc_no_bgm.mp4');
  console.log(' - Ghép nối 12 phân cảnh thành TVC dài...');
  const concatCmd = `ffmpeg -y -f concat -safe 0 -i "${listFilePath}" -c copy "${mergedNoBgmPath}"`;
  execSync(concatCmd, { stdio: 'ignore' });

  // D. Lồng nhạc nền chạy suốt từ đầu đến cuối
  const finalOutPath = path.join(OUTPUT_DIR, 'tvc_glow_60s_completed.mp4');
  if (fs.existsSync(bgmPath)) {
    console.log(' - Lồng nhạc nền và chuẩn hóa âm lượng (Giọng đọc lớn hơn nhạc nền)...');
    // Trộn hai kênh audio: audio 0 (giọng đọc) giữ nguyên volume, audio 1 (BGM) giảm volume xuống 0.12, cắt ngắn BGM theo thời lượng video
    const mixCmd = `ffmpeg -y -i "${mergedNoBgmPath}" -i "${bgmPath}" -filter_complex "[0:a]volume=1.0[a1];[1:a]volume=0.12[a2];[a1][a2]amix=inputs=2:duration=first" -c:v copy -c:a aac "${finalOutPath}"`;
    execSync(mixCmd, { stdio: 'ignore' });
  } else {
    console.log(' - Xuất bản TVC thoại thuần (không nhạc nền)...');
    fs.copyFileSync(mergedNoBgmPath, finalOutPath);
  }

  console.log(`\n=== SẢN XUẤT TVC THÀNH CÔNG! ===`);
  console.log(`Tệp TVC hoàn chỉnh lưu tại: file://${finalOutPath}`);
  
  // Dọn dẹp thư mục tạm
  try {
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
  } catch (e) {}
}

main().catch(err => {
  console.error(`Pipeline failed: ${err.message}`);
  process.exit(1);
});
