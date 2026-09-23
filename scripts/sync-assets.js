import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const sourceDir = path.join(projectRoot, 'Round 1');
const publicGameDir = path.join(projectRoot, 'public', 'game');
const manifestPath = path.join(projectRoot, 'public', 'gameData.json');

// Ensure destination directories exist
if (!fs.existsSync(publicGameDir)) {
  fs.mkdirSync(publicGameDir, { recursive: true });
}

const audioExts = ['.mp3', '.mpeg', '.wav', '.m4a', '.ogg'];
const imageExts = ['.jpg', '.jpeg', '.png', '.webp'];

function getFilesRecursively(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

function processAssets() {
  console.log('Starting Asset Sync & Manifest Generation...');

  const manifest = {
    title: "REEL RUSH",
    tagline: "Movie Audio Quiz • Listen. Identify. Reveal.",
    rounds: [
      {
        id: "round-1",
        name: "Round 1",
        batches: []
      },
      {
        id: "round-2",
        name: "Round 2",
        batches: [
          {
            id: "batch-1",
            name: "Batch 1",
            questions: []
          },
          {
            id: "batch-2",
            name: "Batch 2",
            questions: []
          }
        ]
      }
    ]
  };

  // Find all question folders in Batch 1 and Batch 2
  const batchDirs = [
    {
      id: "batch-1",
      name: "Batch 1",
      source: path.join(sourceDir, 'New folder', 'batch 1', 'New folder')
    },
    {
      id: "batch-2",
      name: "Batch 2",
      source: path.join(sourceDir, 'New folder', 'batch 2')
    }
  ];

  // Populate Round 1
  batchDirs.forEach((batchInfo) => {
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

          const publicAudioUrl = `/game/round-1/${batchInfo.id}/${destAudioName}`;
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

  // Round 2 is ready with Batch 1 and Batch 2 (empty until user adds Round 2 question files)
  manifest.rounds[1].batches = [
    {
      id: "batch-1",
      name: "Batch 1",
      questions: []
    },
    {
      id: "batch-2",
      name: "Batch 2",
      questions: []
    }
  ];
  console.log('Round 2 initialized with empty batches ready for new questions.');

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`Manifest saved to ${manifestPath}`);
}

processAssets();
