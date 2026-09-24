import React, { useState, useCallback, useEffect } from 'react';
import { Eye, RotateCcw, ArrowRight, ArrowLeft, CheckCircle2, XCircle, Volume2, Play } from 'lucide-react';
import { useGameState } from '../../context/GameContext';
import { CustomAudioPlayer } from '../AudioPlayer/CustomAudioPlayer';

export const QuestionPlayScreen: React.FC = () => {
  const {
    currentRound,
    currentBatch,
    currentQuestion,
    questionPlayState,
    setQuestionPlayState,
    markQuestionCompleted,
    nextQuestion,
    prevQuestion,
    navigateTo,
    settings,
  } = useGameState();

  const [autoPlayTrigger, setAutoPlayTrigger] = useState<boolean>(false);
  const [scoreMarked, setScoreMarked] = useState<boolean | null>(null);

  const isImageFirst = currentRound?.type === 'IMAGE_FIRST' || currentRound?.id === 'round-2';

  // Reset local state when question changes
  useEffect(() => {
    setScoreMarked(null);
    setAutoPlayTrigger(false);
  }, [currentQuestion?.id]);

  if (!currentRound || !currentBatch || !currentQuestion) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Question not found.</p>
      </div>
    );
  }

  const qNumStr = String(currentQuestion.number).padStart(2, '0');

  // Handle Audio Start for Round 1
  const handleStartAudio = useCallback(() => {
    setQuestionPlayState('AUDIO_PLAYING');
    setAutoPlayTrigger(true);
  }, [setQuestionPlayState]);

  // Audio ends event (kept in loop without auto switching to thinking page)
  const handleAudioEnded = useCallback(() => {
    // Audio loops continuously; do NOT auto-switch to thinking page!
  }, []);

  // Move to Thinking Loading Page ONLY when user inputs / clicks button
  const handleGoToThinkingPage = useCallback(() => {
    setQuestionPlayState('THINKING');
  }, [setQuestionPlayState]);

  // Handle Show Answer Reveal
  const handleRevealAnswer = useCallback(() => {
    setQuestionPlayState('ANSWER_REVEALED');
    markQuestionCompleted(currentQuestion.id);
  }, [currentQuestion.id, markQuestionCompleted, setQuestionPlayState]);

  // Scoring handlers
  const handleMarkScore = (isCorrect: boolean) => {
    setScoreMarked(isCorrect);
    markQuestionCompleted(currentQuestion.id, isCorrect);
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px 20px 60px 20px',
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      {/* Question Header Info */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-gold)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {currentRound.name} • {currentBatch.name}
        </div>
        <h2 style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: '2px' }}>
          QUESTION {qNumStr}
        </h2>
      </div>

      {/* Main Playing Area */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
        
        {/* ======================================================== */}
        {/* ROUND 2 FLOW: IMAGE FIRST (Image -> Thinking -> Audio)  */}
        {/* ======================================================== */}
        {isImageFirst ? (
          <>
            {/* Step 1: Initial Question Clue Image */}
            {questionPlayState === 'READY' && (
              <div
                className="glass-panel animate-scale-up"
                style={{
                  width: '100%',
                  maxWidth: '900px',
                  padding: '36px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '24px',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                }}
              >
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  LOOK CAREFULLY AT THE CLUE
                </div>

                <div
                  style={{
                    width: '100%',
                    maxHeight: '520px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#000000',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.7)',
                  }}
                >
                  <img
                    src={currentQuestion.answerImage}
                    alt={`Clue for Question ${qNumStr}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '520px',
                      objectFit: 'contain',
                      borderRadius: '12px',
                    }}
                  />
                </div>

                {/* Button to proceed to Thinking Page */}
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '8px' }}>
                  <button
                    className="btn btn-gold btn-large animate-fade-in"
                    onClick={handleGoToThinkingPage}
                    style={{ padding: '16px 48px', fontSize: '1.3rem', boxShadow: '0 8px 30px var(--accent-gold-glow)' }}
                  >
                    Thinking
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Thinking Page */}
            {questionPlayState === 'THINKING' && (
              <div
                className="glass-panel animate-scale-up"
                style={{
                  width: '100%',
                  maxWidth: '800px',
                  padding: '50px 40px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '28px',
                  borderColor: 'var(--accent-gold)',
                  boxShadow: '0 0 45px var(--accent-gold-glow)',
                }}
              >
                <div
                  className="pulse-glow"
                  style={{
                    fontSize: '4.5rem',
                    width: '110px',
                    height: '110px',
                    borderRadius: '50%',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '3px solid var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 30px var(--accent-gold-glow)',
                  }}
                >
                  🤔
                </div>

                <div>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '0.02em', color: '#ffffff' }}>
                    GUESS THE SONG 🤔
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
                  <button
                    className="btn btn-gold btn-large"
                    onClick={handleRevealAnswer}
                    style={{ padding: '18px 48px', fontSize: '1.35rem' }}
                  >
                    <Eye size={24} /> Show answer
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => setQuestionPlayState('READY')}
                    style={{ padding: '16px 28px', fontSize: '1.1rem' }}
                  >
                    VIEW CLUE AGAIN
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Answer Revealed (Play Audio Answer) */}
            {questionPlayState === 'ANSWER_REVEALED' && (
              <div
                className="glass-panel animate-scale-up"
                style={{
                  width: '100%',
                  maxWidth: '900px',
                  padding: '36px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '24px',
                  borderColor: 'var(--accent-green)',
                }}
              >
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-green)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  CORRECT ANSWER AUDIO
                </div>

                {/* Answer Audio Player playing in loop */}
                <CustomAudioPlayer
                  audioUrl={currentQuestion.audio}
                  autoPlayTrigger={true}
                />

                {/* Preview of Clue Image */}
                <div
                  style={{
                    width: '100%',
                    maxHeight: '260px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#000000',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '8px',
                  }}
                >
                  <img
                    src={currentQuestion.answerImage}
                    alt={`Clue for Question ${qNumStr}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '260px',
                      objectFit: 'contain',
                    }}
                  />
                </div>

                {/* Optional Scoring */}
                {settings.enableScoring && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px 28px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '14px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-secondary)' }}>MARK SCORE:</span>
                    <button
                      className={`btn ${scoreMarked === true ? 'btn-green' : 'btn-secondary'}`}
                      onClick={() => handleMarkScore(true)}
                      style={{ padding: '10px 20px' }}
                    >
                      <CheckCircle2 size={18} /> CORRECT (+{settings.pointsPerCorrectAnswer})
                    </button>
                    <button
                      className={`btn ${scoreMarked === false ? 'btn-red' : 'btn-secondary'}`}
                      onClick={() => handleMarkScore(false)}
                      style={{ padding: '10px 20px' }}
                    >
                      <XCircle size={18} /> WRONG (0)
                    </button>
                  </div>
                )}

                {/* Direct Next Question Action */}
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
                  <button
                    className="btn btn-gold btn-large"
                    onClick={nextQuestion}
                    style={{ padding: '14px 36px' }}
                  >
                    Next Question <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* ======================================================== */
          /* ROUND 1 FLOW: AUDIO FIRST (Audio -> Thinking -> Image)  */
          /* ======================================================== */
          <>
            {/* State 1: READY (Audio not started) */}
            {questionPlayState === 'READY' && (
              <div
                className="glass-panel animate-scale-up"
                style={{
                  width: '100%',
                  maxWidth: '800px',
                  padding: '60px 40px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '24px',
                  borderColor: 'var(--accent-indigo)',
                }}
              >
                <div
                  className="pulse-glow"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '2px solid var(--accent-indigo)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-indigo)',
                  }}
                >
                  <Volume2 size={40} />
                </div>

                <div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
                    LISTEN CAREFULLY
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '6px' }}>
                    Prepare to identify the movie clip.
                  </p>
                </div>

                <button
                  className="btn btn-gold btn-large"
                  onClick={handleStartAudio}
                  style={{ padding: '18px 48px', fontSize: '1.4rem' }}
                >
                  <Play size={24} fill="#000000" /> PRESS ENTER TO START
                </button>
              </div>
            )}

            {/* State 2: Audio Playing in Loop */}
            {(questionPlayState === 'AUDIO_PLAYING' || questionPlayState === 'AUDIO_COMPLETED') && (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                <CustomAudioPlayer
                  audioUrl={currentQuestion.audio}
                  onAudioStart={() => setQuestionPlayState('AUDIO_PLAYING')}
                  onAudioEnded={handleAudioEnded}
                  autoPlayTrigger={autoPlayTrigger}
                />

                {/* User Input Button to switch from audio playback to the Thinking / Loading Page */}
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px' }}>
                  <button
                    className="btn btn-gold btn-large animate-fade-in"
                    onClick={handleGoToThinkingPage}
                    style={{ padding: '16px 48px', fontSize: '1.3rem', boxShadow: '0 8px 30px var(--accent-gold-glow)' }}
                  >
                    Thinking
                  </button>
                </div>
              </div>
            )}

            {/* State 3: THINKING (Thinking Page with Thinking Emoji 🤔) */}
            {questionPlayState === 'THINKING' && (
              <div
                className="glass-panel animate-scale-up"
                style={{
                  width: '100%',
                  maxWidth: '800px',
                  padding: '50px 40px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '28px',
                  borderColor: 'var(--accent-gold)',
                  boxShadow: '0 0 45px var(--accent-gold-glow)',
                }}
              >
                <div
                  className="pulse-glow"
                  style={{
                    fontSize: '4.5rem',
                    width: '110px',
                    height: '110px',
                    borderRadius: '50%',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '3px solid var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 30px var(--accent-gold-glow)',
                  }}
                >
                  🤔
                </div>

                <div>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '0.02em', color: '#ffffff' }}>
                    IDENTIFY THE MOVIE 🤔
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
                  <button
                    className="btn btn-gold btn-large"
                    onClick={handleRevealAnswer}
                    style={{ padding: '18px 48px', fontSize: '1.35rem' }}
                  >
                    <Eye size={24} /> Show answer
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => setQuestionPlayState('AUDIO_PLAYING')}
                    style={{ padding: '16px 28px', fontSize: '1.1rem' }}
                  >
                    <RotateCcw size={20} /> REPLAY AUDIO (R)
                  </button>
                </div>
              </div>
            )}

            {/* State 4: ANSWER_REVEALED */}
            {questionPlayState === 'ANSWER_REVEALED' && (
              <div
                className="glass-panel animate-scale-up"
                style={{
                  width: '100%',
                  maxWidth: '900px',
                  padding: '36px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '24px',
                  borderColor: 'var(--accent-green)',
                }}
              >
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-green)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  CORRECT ANSWER
                </div>

                <div
                  style={{
                    width: '100%',
                    maxHeight: '520px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#000000',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.7)',
                  }}
                >
                  <img
                    src={currentQuestion.answerImage}
                    alt={`Answer for Question ${qNumStr}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '520px',
                      objectFit: 'contain',
                      borderRadius: '12px',
                    }}
                  />
                </div>

                {/* Optional Scoring Buttons */}
                {settings.enableScoring && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px 28px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '14px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-secondary)' }}>MARK SCORE:</span>
                    <button
                      className={`btn ${scoreMarked === true ? 'btn-green' : 'btn-secondary'}`}
                      onClick={() => handleMarkScore(true)}
                      style={{ padding: '10px 20px' }}
                    >
                      <CheckCircle2 size={18} /> CORRECT (+{settings.pointsPerCorrectAnswer})
                    </button>
                    <button
                      className={`btn ${scoreMarked === false ? 'btn-red' : 'btn-secondary'}`}
                      onClick={() => handleMarkScore(false)}
                      style={{ padding: '10px 20px' }}
                    >
                      <XCircle size={18} /> WRONG (0)
                    </button>
                  </div>
                )}

                {/* Next / Replay Action Bar */}
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setQuestionPlayState('AUDIO_PLAYING')}
                  >
                    <RotateCcw size={18} /> REPLAY AUDIO (R)
                  </button>

                  <button
                    className="btn btn-gold btn-large"
                    onClick={nextQuestion}
                    style={{ padding: '14px 36px' }}
                  >
                    Next Question <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Host Controls & Navigation Footer */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '36px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {settings.gameMode === 'host' && (
          <button className="btn btn-secondary" onClick={prevQuestion}>
            <ArrowLeft size={16} /> PREVIOUS QUESTION
          </button>
        )}

        <button className="btn btn-secondary" onClick={() => navigateTo('QUESTION_SELECT')}>
          <ArrowLeft size={16} /> BACK TO QUESTIONS
        </button>
      </div>
    </div>
  );
};
