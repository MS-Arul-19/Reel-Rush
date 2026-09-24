import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const round1SourceDir = path.join(projectRoot, 'Round 1');
const round2SourceDir = path.join(projectRoot, 'New folder (2)');
const publicGameDir = path.join(projectRoot, 'public', 'game');
const manifestPath = path.join(projectRoot, 'public', 'gameData.json');

// Ensure destination directories exist
if (!fs.existsSync(publicGameDir)) {
  fs.mkdirSync(publicGameDir, { recursive: true });
}

const audioExts = ['.mp3', '.mpeg', '.wav', '.m4a', '.ogg'];
const imageExts = ['.jpg', '.jpeg', '.png', '.webp'];

function processAssets() {
  console.log('Starting Asset Sync & Manifest Generation...');

  const manifest = {
    title: "REEL RUSH",
    tagline: "Movie Audio Quiz • Listen. Identify. Reveal.",
    rounds: [
      {
        id: "round-1",
        name: "ROUND 1 | DIALOGUE DECODE",
        description: "IDENTIFY THE TAMIL MOVIE FROM THE GIVEN DIALOGUE.",
        rules: "FIXED TIME | +2 PER CORRECT ANSWER",
        type: "AUDIO_FIRST",
        batches: []
      },
      {
        id: "round-2",
        name: "ROUND 2 | TUNE HUNT",
        description: "IDENTIFY THE TAMIL SONG FROM ENGLISH-TRANSLATED LYRICS & SING IT!",
        rules: "+2 PER CORRECT SONG",
        type: "IMAGE_FIRST",
        batches: []
      }
    ]
  };

  // --- Process Round 1 ---
  const round1Batches = [
    {
      id: "batch-1",
      name: "Batch 1",
      source: path.join(round1SourceDir, 'New folder', 'batch 1', 'New folder')
    },
    {
      id: "batch-2",
      name: "Batch 2",
      source: path.join(round1SourceDir, 'New folder', 'batch 2')
    }
  ];

  round1Batches.forEach((batchInfo) => {
    const destBatchDir = path.join(publicGameDir, 'round-1', batchInfo.id);
    if (!fs.existsSync(destBatchDir)) {
      fs.mkdirSync(destBatchDir, { recursive: true });
    }

    const questions = [];
    if (fs.existsSync(batchInfo.source)) {
      const qFolders = fs.readdirSync(batchInfo.source).filter((f) => {
        return fs.statSync(path.join(batchInfo.source, f)).isDirectory() && f.toLowerCase().startsWith('no.');
      });

      qFolders.sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
        return numA - numB;
      });

      qFolders.forEach((folderName) => {
        const num = parseInt(folderName.replace(/\D/g, ''), 10);
        const padNum = String(num).padStart(2, '0');
        const qId = `question-${padNum}`;

        const folderPath = path.join(batchInfo.source, folderName);
        const files = fs.readdirSync(folderPath);

        let audioSource = null;
        let imageSource = null;

        files.forEach((file) => {
          const ext = path.extname(file).toLowerCase();
          if (audioExts.includes(ext) && !audioSource) {
            audioSource = path.join(folderPath, file);
          } else if (imageExts.includes(ext) && !imageSource) {
            imageSource = path.join(folderPath, file);
          }
        });

        if (audioSource && imageSource) {
          const audioExt = path.extname(audioSource);
          const imageExt = path.extname(imageSource);

          const destAudioName = `${qId}${audioExt}`;
          const destImageName = `${qId}${imageExt}`;

          const destAudioPath = path.join(destBatchDir, destAudioName);
          const destImagePath = path.join(destBatchDir, destImageName);

          fs.copyFileSync(audioSource, destAudioPath);
          fs.copyFileSync(imageSource, destImagePath);

          // Prefer .mp3 if exists (from enhance script), otherwise destAudioName
          const mp3File = `${qId}.mp3`;
          const audioFileName = fs.existsSync(path.join(destBatchDir, mp3File)) ? mp3File : destAudioName;

          const publicAudioUrl = `/game/round-1/${batchInfo.id}/${audioFileName}`;
          const publicImageUrl = `/game/round-1/${batchInfo.id}/${destImageName}`;

          questions.push({
            id: qId,
            number: num,
            audio: publicAudioUrl,
            answerImage: publicImageUrl
          });
        }
      });
    }

    manifest.rounds[0].batches.push({
      id: batchInfo.id,
      name: batchInfo.name,
      questions: questions
    });

    console.log(`Processed ${questions.length} questions for Round 1 - ${batchInfo.name}`);
  });

  // --- Process Round 2 ---
  const round2Batches = [
    {
      id: "batch-1",
      name: "Batch 1",
      source: path.join(round2SourceDir, 'batch 1')
    },
    {
      id: "batch-2",
      name: "Batch 2",
      source: path.join(round2SourceDir, 'batch 2')
    }
  ];

  round2Batches.forEach((batchInfo) => {
    const destBatchDir = path.join(publicGameDir, 'round-2', batchInfo.id);
    if (!fs.existsSync(destBatchDir)) {
      fs.mkdirSync(destBatchDir, { recursive: true });
    }

    const questions = [];
    if (fs.existsSync(batchInfo.source)) {
      const qFolders = fs.readdirSync(batchInfo.source).filter((f) => {
        return fs.statSync(path.join(batchInfo.source, f)).isDirectory() && f.toLowerCase().startsWith('no.');
      });

      qFolders.sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
        return numA - numB;
      });

      qFolders.forEach((folderName) => {
        const num = parseInt(folderName.replace(/\D/g, ''), 10);
        const padNum = String(num).padStart(2, '0');
        const qId = `question-${padNum}`;

        const folderPath = path.join(batchInfo.source, folderName);
        const files = fs.readdirSync(folderPath);

        let audioSource = null;
        let imageSource = null;

        files.forEach((file) => {
          const ext = path.extname(file).toLowerCase();
          if (audioExts.includes(ext) && !audioSource) {
            audioSource = path.join(folderPath, file);
          } else if (imageExts.includes(ext) && !imageSource) {
            imageSource = path.join(folderPath, file);
          }
        });

        if (audioSource && imageSource) {
          const audioExt = path.extname(audioSource);
          const imageExt = path.extname(imageSource);

          const destAudioName = `${qId}${audioExt}`;
          const destImageName = `${qId}${imageExt}`;

          const destAudioPath = path.join(destBatchDir, destAudioName);
          const destImagePath = path.join(destBatchDir, destImageName);

          fs.copyFileSync(audioSource, destAudioPath);
          fs.copyFileSync(imageSource, destImagePath);

          const mp3File = `${qId}.mp3`;
          const audioFileName = fs.existsSync(path.join(destBatchDir, mp3File)) ? mp3File : destAudioName;

          const publicAudioUrl = `/game/round-2/${batchInfo.id}/${audioFileName}`;
          const publicImageUrl = `/game/round-2/${batchInfo.id}/${destImageName}`;

          questions.push({
            id: qId,
            number: num,
            audio: publicAudioUrl,
            answerImage: publicImageUrl
          });
        }
      });
    }

    manifest.rounds[1].batches.push({
      id: batchInfo.id,
      name: batchInfo.name,
      questions: questions
    });

    console.log(`Processed ${questions.length} questions for Round 2 - ${batchInfo.name}`);
  });

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`Manifest saved to ${manifestPath}`);
}

processAssets();
