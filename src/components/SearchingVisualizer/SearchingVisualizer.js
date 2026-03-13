'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import Controls from '@/components/Controls/Controls';
import ExplanationPanel from '@/components/ExplanationPanel/ExplanationPanel';
import { SEARCHING_ALGORITHMS, SEARCHING_INFO } from '@/algorithms/searching';
import { useAnimation } from '@/hooks/useAnimation';
import styles from './SearchingVisualizer.module.css';

const algoKeys = ['linear', 'binary', 'jump', 'interpolation'];
const algoMap = {
  linear: 'linearSearch', binary: 'binarySearch',
  jump: 'jumpSearch', interpolation: 'interpolationSearch',
};

function generateArray(size = 20) {
  const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
  return arr.sort((a, b) => a - b);
}

export default function SearchingVisualizer() {
  const [selectedAlgo, setSelectedAlgo] = useState('linear');
  const [array, setArray] = useState(() => generateArray());
  const [target, setTarget] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const stepsRef = useRef([]);

  const generateSteps = useCallback((arr, algoKey, t) => {
    if (!t && t !== 0) return;
    const fn = SEARCHING_ALGORITHMS[algoMap[algoKey]];
    const allSteps = [...fn(arr, Number(t))];
    stepsRef.current = allSteps;
    setSteps(allSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const handleSearch = useCallback(() => {
    if (target === '') return;
    generateSteps(array, selectedAlgo, Number(target));
  }, [array, selectedAlgo, target, generateSteps]);

  const handleGenerate = useCallback(() => {
    const newArr = generateArray();
    setArray(newArr);
    setSteps([]);
    setCurrentStep(0);
  }, []);

  const stepForward = useCallback(() => {
    setCurrentStep(prev => {
      if (prev >= stepsRef.current.length - 1) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, []);

  useAnimation(stepForward, isPlaying, speed);

  const currentState = steps[currentStep] || { array, current: -1, found: -1, window: [], message: '' };
  const displayArray = currentState.array || array;
  const maxVal = Math.max(...displayArray, 1);

  const algoInfo = { ...SEARCHING_INFO[selectedAlgo], activeLine: currentState.line };

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Searching Algorithms</h1>
        <div className={styles.algoSelect}>
          {algoKeys.map(key => (
            <button key={key} className={`${styles.algoBtn} ${selectedAlgo === key ? styles.active : ''}`}
              onClick={() => { setSelectedAlgo(key); setSteps([]); setCurrentStep(0); }}>
              {SEARCHING_INFO[key].name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.inputSection}>
        <input className={styles.inputField} type="number" placeholder="Search target..."
          value={target} onChange={(e) => setTarget(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
        <button className={styles.generateBtn} onClick={handleSearch}>Search</button>
        <button className={styles.generateBtn} onClick={handleGenerate}>New Array</button>
      </div>

      <div className={styles.canvasWrapper}>
        {displayArray.map((val, i) => {
          let cls = styles.default;
          if (currentState.found === i) cls = styles.found;
          else if (currentState.current === i) cls = styles.current;
          else if (currentState.window?.length === 2 && i >= currentState.window[0] && i <= currentState.window[1]) cls = styles.inWindow;
          return (
            <div key={i} className={styles.cell}>
              <div className={`${styles.bar} ${cls}`} style={{ height: `${(val / maxVal) * 200}px` }}>
                <span className={styles.barValue}>{val}</span>
              </div>
              <span className={styles.barIndex}>{i}</span>
            </div>
          );
        })}
      </div>

      <Controls isPlaying={isPlaying} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}
        onStep={stepForward} onReset={() => { setCurrentStep(0); setIsPlaying(false); }}
        speed={speed} onSpeedChange={setSpeed} currentStep={currentStep} totalSteps={steps.length}
        message={currentState.message} disabled={steps.length === 0} />

      <ExplanationPanel algorithm={algoInfo} />
    </div>
  );
}
