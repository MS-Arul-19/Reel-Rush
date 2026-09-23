import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const projectRoot = process.cwd();
const publicGameDir = path.join(projectRoot, 'public', 'game');
const manifestPath = path.join(projectRoot, 'public', 'gameData.json');

const batches = [
  path.join(publicGameDir, 'round-1', 'batch-1'),
  path.join(publicGameDir, 'round-1', 'batch-2'),
];

console.log('--- Starting Audio Enhancement & Noise Reduction ---');

// Audio Filter Chain:
// 1. highpass: eliminates sub-bass mic rumble & wind noise
// 2. lowpass: eliminates high frequency hiss & digital artifacts
// 3. afftdn: FFT-based background noise suppression
// 4. equalizer: enhances vocal presence and movie dialogue clarity (+3.5dB at 2.8kHz)
// 5. loudnorm: professional loudness normalization for loud, punchy, distortion-free sound
const audioFilter = 'highpass=f=80,lowpass=f=12000,afftdn=nf=-22,equalizer=f=2800:t=q:w=1.2:g=3.5,loudnorm=I=-14:TP=-1.0:LRA=9';

batches.forEach((batchDir) => {
  if (!fs.existsSync(batchDir)) return;
  const files = fs.readdirSync(batchDir);

  files.forEach((file) => {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.mpeg' || ext === '.wav' || ext === '.ogg' || ext === '.m4a' || ext === '.mp3') {
      const baseName = path.basename(file, ext);
      const inputPath = path.join(batchDir, file);
      const tempPath = path.join(batchDir, `${baseName}_enhanced.mp3`);
      const targetMp3Path = path.join(batchDir, `${baseName}.mp3`);

      try {
        console.log(`Processing: ${file} in ${path.basename(batchDir)}...`);
        const cmd = `ffmpeg -y -i "${inputPath}" -af "${audioFilter}" -b:a 320k -ar 44100 "${tempPath}"`;
        execSync(cmd, { stdio: 'ignore' });

        // If target file is different from input, replace
        if (fs.existsSync(tempPath)) {
          if (fs.existsSync(targetMp3Path) && targetMp3Path !== inputPath) {
            fs.unlinkSync(targetMp3Path);
          }
          fs.renameSync(tempPath, targetMp3Path);
        }
        console.log(`✓ Enhanced: ${baseName}.mp3`);
      } catch (err) {
        console.error(`Failed to process ${file}:`, err.message);
      }
    }
  });
});

// Update gameData.json manifest to point to .mp3 files
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  manifest.rounds.forEach((round) => {
    round.batches.forEach((batch) => {
      batch.questions.forEach((q) => {
        // Replace extension with .mp3
        q.audio = q.audio.replace(/\.(mpeg|wav|ogg|m4a|mp3)$/i, '.mp3');
      });
    });
  });

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('✓ Updated gameData.json manifest with enhanced .mp3 audio paths!');
}

console.log('--- Audio Enhancement Completed Successfully! ---');
