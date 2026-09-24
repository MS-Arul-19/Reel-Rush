export type GameScreen =
  | 'HOME'
  | 'HOW_TO_PLAY'
  | 'SETTINGS'
  | 'ROUND_SELECT'
  | 'BATCH_SELECT'
  | 'QUESTION_SELECT'
  | 'QUESTION_PLAY'
  | 'BATCH_COMPLETE'
  | 'ROUND_COMPLETE';

export type QuestionPlayState =
  | 'READY'            // Initial screen state: "LISTEN CAREFULLY", prompt: "PRESS ENTER TO START"
  | 'AUDIO_PLAYING'    // Audio is playing, visualizer running
  | 'AUDIO_COMPLETED'  // Audio finished playing
  | 'THINKING'         // Loading / Thinking page with thinking emoji 🤔 and SHOW ANSWER button
  | 'ANSWER_REVEALED'; // Answer image revealed with animation

export type GameMode = 'host' | 'player';

export interface Question {
  id: string;          // e.g. "question-01"
  number: number;      // e.g. 1
  audio: string;       // path to audio file
  answerImage: string; // path to answer image
}

export interface Batch {
  id: string;          // e.g. "batch-1"
  name: string;        // e.g. "Batch 1"
  questions: Question[];
}

export interface Round {
  id: string;          // e.g. "round-1"
  name: string;        // e.g. "ROUND 1 | DIALOGUE DECODE"
  description?: string; // e.g. "IDENTIFY THE TAMIL MOVIE FROM THE GIVEN DIALOGUE."
  rules?: string;       // e.g. "FIXED TIME | +2 PER CORRECT ANSWER"
  type?: 'AUDIO_FIRST' | 'IMAGE_FIRST';
  batches: Batch[];
}

export interface GameManifest {
  title: string;
  tagline: string;
  rounds: Round[];
}

export interface GameSettings {
  gameMode: GameMode;               // "host" | "player"
  enableScoring: boolean;           // default false
  pointsPerCorrectAnswer: number;   // default 10
  timerEnabled: boolean;            // default false
  timerDuration: number;           // default 30 (seconds)
  freeQuestionSelection: boolean;   // default true
  persistProgress: boolean;         // default true
}

export interface QuestionResult {
  questionId: string;
  batchId: string;
  roundId: string;
  isCorrect?: boolean;
  pointsEarned?: number;
}
