import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const round2Data = {
  'batch-1': [
    {
      id: 'question-01',
      lines: [
        "A woman’s beauty is right before your eyes,",
        "Youth is just within reach to settle in.",
        "To make you sway, like the sweet water of",
        "a tender coconut,",
        "Shall I offer you something",
        "Perfect and soothing? ..... hoi"
      ]
    },
    {
      id: 'question-02',
      lines: [
        "Alcohol is my leg,",
        "Goat's milk is my shoulder,",
        "A sexy scorpion,",
        "Sixty litres of petrol."
      ]
    },
    {
      id: 'question-03',
      lines: [
        "Every place you touched,",
        "Still burns with your love.",
        "Every moment I live,",
        "Belongs to you, my love."
      ]
    },
    {
      id: 'question-04',
      lines: [
        "At the door where you left me,",
        "I'm still waiting endlessly.",
        "All the love inside my heart,",
        "I'll keep safe for you, my dear."
      ]
    },
    {
      id: 'question-05',
      lines: [
        "Come and touch,",
        "His blood will surge.",
        "Who is the one with a horse's horn?",
        "He is like the light.."
      ]
    },
    {
      id: 'question-06',
      lines: [
        "In the vegetable garden, I am a brinjal.",
        "In the English months, I am January.",
        "In the flowing river, I am the Kaveri.",
        "In non-vegetarian food, I am venison meat."
      ]
    },
    {
      id: 'question-07',
      lines: [
        "A rough boy and a tough girl,",
        "The time has come for us to meet.",
        "A crazy heart and a gentle beat,",
        "Have become one, nice and sweet."
      ]
    },
    {
      id: 'question-08',
      lines: [
        "No edits, no filters, you're naturally bright,",
        "One look at your face fills my heart with delight.",
        "No music is playing, no rhythm in sight,",
        "But seeing you makes my feet feel light."
      ]
    },
    {
      id: 'question-09',
      lines: [
        "Hey, is it just one or two?",
        "The moment I saw you, desire sparked.",
        "You stand there looking as cool as a Jigarthanda!",
        "Mischief and wrongs...",
        "Once you agree to do them,",
        "Like a beetle, I've come to tell you that",
        "I will rest upon the flower."
      ]
    },
    {
      id: 'question-10',
      lines: [
        "You are dazzling with your eyes,",
        "You are exploding like Tapas Ah!",
        "You are dazzling with your eyes,",
        "You are exploding like Tapas Ah!"
      ]
    },
    {
      id: 'question-11',
      lines: [
        "He asks for the name,",
        "and after asking, he stares.",
        "He looks at that,",
        "and after looking, he walks away.",
        "He rubs his hands,",
        "and after rubbing, he strikes.",
        "He strikes with his eyes,",
        "and after striking... Ah... ha... he touched me!"
      ]
    },
    {
      id: 'question-12',
      lines: [
        "If you ask, I’ll even let you go from my own hands.",
        "Go on, live your life like a dream.",
        "I fell in love with you deeply.",
        "Even after losing, it didn’t end.",
        "Even after you left, it didn’t change."
      ]
    },
    {
      id: 'question-13',
      lines: [
        "Lighting my heart with her sparkler-smile,",
        "trampling my arrogance in her own style.",
        "This enchantress, my 'other woman'",
        "made me forget my wife!",
        "Like her pet dog I sniffed behind",
        "every step of the way into her life...."
      ]
    },
    {
      id: 'question-14',
      lines: [
        "You walked away from me,",
        "I searched for you slowly.",
        "I couldn't think of anything,",
        "I didn't even want to ask your name.",
        "",
        "My shy heart wants you near,",
        "Even in my sleep, I think of you.",
        "Your smile never changed,",
        "My heart dances when I see you."
      ]
    },
    {
      id: 'question-15',
      lines: [
        "Come closer, boy, and get caught",
        "in the lipstick stain on my lips!",
        "",
        "You’re a matchstick made of ten fingers—",
        "come light the fire, girl!"
      ]
    }
  ],
  'batch-2': [
    {
      id: 'question-01',
      lines: [
        "You are as sweet as cotton candy!",
        "Yes, cotton candy!",
        "Oh my, cotton candy!",
        "You are as sweet as cotton candy!",
        "Yes, cotton candy!",
        "Oh my, cotton candy!"
      ]
    },
    {
      id: 'question-02',
      lines: [
        "Some will come along with us,",
        "Some will leave halfway through.",
        "Who stays and who goes,",
        "Is not in our hands to choose."
      ]
    },
    {
      id: 'question-03',
      lines: [
        "Whenever I board a taxi,",
        "I pay more than the meter price and grin;",
        "and when I board a bus and ask for a seat,",
        "the driver gives up his own seat and stands aside."
      ]
    },
    {
      id: 'question-04',
      lines: [
        "There is no one to care about",
        "the moon in the wild..",
        "We don’t fall in love with",
        "the permission of our eyes...."
      ]
    },
    {
      id: 'question-05',
      lines: [
        "Cigarette on two fingers,",
        "When you pull it, it's like a fire.",
        "When you smoke it, it's like a cigarette.",
        "When you smoke it, it's like a joy.",
        "No dreams, no worries,",
        "There's no one like this.."
      ]
    },
    {
      id: 'question-06',
      lines: [
        "He has a moon shape on his forehead,",
        "He moves around like a whirlwind!",
        "Let the entire southern district,",
        "Gather around with a loud roar!"
      ]
    },
    {
      id: 'question-07',
      lines: [
        "The cool wind from Courtallam is blowing,",
        "Dancing at the right time,",
        "Now the heat is rising by itself...",
        "aa... aaa... aa..."
      ]
    },
    {
      id: 'question-08',
      lines: [
        "A dark forest,",
        "a line between just two people.",
        "There is heat in my thoughts,",
        "inside this cage of bars where I live."
      ]
    },
    {
      id: 'question-09',
      lines: [
        "If we, as stars, also come and ask for votes,",
        "No one will look at caste at all.",
        "If you truly think about the poor and the helpless,",
        "Tomorrow you, too, will become the Chief Minister."
      ]
    },
    {
      id: 'question-10',
      lines: [
        "I am known in town by another name too.",
        "You will shiver in fear hearing it, dude!",
        "Print out the poster, all-ready is your brother.",
        "Celebrate and howl! Set it ablaze now..."
      ]
    },
    {
      id: 'question-11',
      lines: [
        "It feels like I am newly born, girl,",
        "When you smile, my heart heals, girl,",
        "Golden love is calling, girl,",
        "Don't just brush me off so easily, girl..."
      ]
    },
    {
      id: 'question-12',
      lines: [
        "Tall girl or short girl,",
        "All plans are the same.",
        "All body is full of love,",
        "A sweet mind yearns to steal.."
      ]
    },
    {
      id: 'question-13',
      lines: [
        "I'm a golden-hearted guy,",
        "Don't you know that about me?",
        "I'll always take good care of you,",
        "Can't you really see?"
      ]
    },
    {
      id: 'question-14',
      lines: [
        "Monica, my dearest love,",
        "My sweet baby girl,",
        "You tickle my heart and make me smile,",
        "Now you are caught in my love forever."
      ]
    },
    {
      id: 'question-15',
      lines: [
        "I am old to speed.",
        "Oh, I am new to shyness.",
        "I am old to the beginning.",
        "Oh, hey, I am new to love."
      ]
    }
  ]
};

function renderCard(item, batchId) {
  const lineCount = item.lines.filter(l => l.trim().length > 0).length;
  let fontSize = 52;
  let lineHeight = 1.7;

  if (lineCount >= 7) {
    fontSize = 42;
    lineHeight = 1.6;
  } else if (lineCount >= 5) {
    fontSize = 48;
    lineHeight = 1.65;
  } else if (lineCount <= 4) {
    fontSize = 54;
    lineHeight = 1.75;
  }

  const textHtml = item.lines
    .map(line => {
      if (!line) return '<div style="height: 24px;"></div>';
      // Format special last words like "..... hoi" if present
      if (line.includes('..... hoi')) {
        return line.replace('..... hoi', '..... <span style="color: #f7c948; font-style: italic;">hoi</span>');
      }
      return `<div>${line}</div>`;
    })
    .join('\n');

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1536px;
    height: 1024px;
    background: #000000;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Georgia, 'Times New Roman', serif;
    font-style: italic;
    text-align: center;
    overflow: hidden;
    padding: 60px 80px;
  }
  .card-container {
    max-width: 1300px;
    font-size: ${fontSize}px;
    line-height: ${lineHeight};
    letter-spacing: 0.015em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
</head>
<body>
  <div class="card-container">
    ${textHtml}
  </div>
</body>
</html>`;

  const tempHtmlPath = path.resolve(`scratch/temp_${batchId}_${item.id}.html`);
  fs.writeFileSync(tempHtmlPath, html);

  const fileUrl = 'file:///' + tempHtmlPath.replace(/\\/g, '/');
  const targetDir = path.resolve(`public/game/round-2/${batchId}`);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Save as both .jpeg and .png so any reference works immediately
  const outPng = path.join(targetDir, `${item.id}.png`);
  const outJpeg = path.join(targetDir, `${item.id}.jpeg`);

  execSync(`"${chromePath}" --headless --disable-gpu --screenshot="${outPng}" --window-size=1536,1024 "${fileUrl}"`, { stdio: 'ignore' });
  // Also copy to .jpeg
  fs.copyFileSync(outPng, outJpeg);

  // Clean up temp html
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }

  console.log(`Generated: round-2/${batchId}/${item.id} (1536x1024)`);
}

console.log('--- Generating All 30 Consistent Round 2 Question Cards ---');
for (const [batchId, items] of Object.entries(round2Data)) {
  console.log(`Processing ${batchId}...`);
  for (const item of items) {
    renderCard(item, batchId);
  }
}
console.log('--- Completed All Round 2 Question Cards! ---');
