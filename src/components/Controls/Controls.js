'use client';
import styles from './Controls.module.css';

export default function Controls({
  isPlaying, onPlay, onPause, onStep, onReset, speed, onSpeedChange,
  currentStep, totalSteps, message, disabled
}) {
  return (
    <div className={styles.controls}>
      <div className={styles.btnGroup}>
        {isPlaying ? (
          <button className={`${styles.btn} ${styles.primary}`} onClick={onPause} title="Pause">
            ⏸
          </button>
        ) : (
          <button className={`${styles.btn} ${styles.primary}`} onClick={onPlay} disabled={disabled} title="Play">
            ▶
          </button>
        )}
        <button className={styles.btn} onClick={onStep} disabled={disabled || isPlaying} title="Step Forward">
          ⏭
        </button>
        <button className={`${styles.btn} ${styles.danger}`} onClick={onReset} title="Reset">
          ↺
        </button>
      </div>
      <span className={styles.stepInfo}>
        Step {currentStep}/{totalSteps}
      </span>
      <div className={styles.speedControl}>
        <span className={styles.speedLabel}>Speed</span>
        <input
          type="range"
          min="1"
          max="100"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className={styles.speedSlider}
        />
      </div>
      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
}
