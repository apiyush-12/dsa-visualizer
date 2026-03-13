'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import Controls from '@/components/Controls/Controls';
import ExplanationPanel from '@/components/ExplanationPanel/ExplanationPanel';
import { SORTING_ALGORITHMS, SORTING_INFO } from '@/algorithms/sorting';
import { useAnimation } from '@/hooks/useAnimation';
import styles from './SortingVisualizer.module.css';

const algoKeys = ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap'];
const algoMap = {
  bubble: 'bubbleSort', selection: 'selectionSort', insertion: 'insertionSort',
  merge: 'mergeSort', quick: 'quickSort', heap: 'heapSort',
};

function generateArray(size = 30) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 5);
}

export default function SortingVisualizer() {
  const [selectedAlgo, setSelectedAlgo] = useState('bubble');
  const [array, setArray] = useState(() => generateArray());
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [inputValue, setInputValue] = useState('');
  const stepsRef = useRef([]);

  const generateSteps = useCallback((arr, algoKey) => {
    const fn = SORTING_ALGORITHMS[algoMap[algoKey]];
    const allSteps = [...fn(arr)];
    stepsRef.current = allSteps;
    setSteps(allSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const handleGenerate = useCallback(() => {
    const newArr = generateArray();
    setArray(newArr);
    generateSteps(newArr, selectedAlgo);
  }, [selectedAlgo, generateSteps]);

  const handleCustomInput = useCallback(() => {
    const vals = inputValue.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v) && v > 0);
    if (vals.length >= 2) {
      setArray(vals);
      generateSteps(vals, selectedAlgo);
    }
  }, [inputValue, selectedAlgo, generateSteps]);

  const handleAlgoChange = useCallback((key) => {
    setSelectedAlgo(key);
    const newArr = [...array];
    generateSteps(newArr, key);
  }, [array, generateSteps]);

  useEffect(() => {
    generateSteps(array, selectedAlgo);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const currentState = steps[currentStep] || { array, comparing: [], swapping: [], sorted: [], message: '' };
  const displayArray = currentState.array || array;
  const maxVal = Math.max(...displayArray, 1);
  const barWidth = Math.max(8, Math.min(40, Math.floor(800 / displayArray.length) - 2));

  const algoInfo = { ...SORTING_INFO[selectedAlgo], activeLine: currentState.line };

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Sorting Algorithms</h1>
        <div className={styles.algoSelect}>
          {algoKeys.map(key => (
            <button
              key={key}
              className={`${styles.algoBtn} ${selectedAlgo === key ? styles.active : ''}`}
              onClick={() => handleAlgoChange(key)}
            >
              {SORTING_INFO[key].name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.inputSection}>
        <input
          className={styles.inputField}
          placeholder="Enter values: 5, 3, 8, 1, 9, 2"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCustomInput()}
        />
        <button className={styles.generateBtn} onClick={handleCustomInput}>
          Set Array
        </button>
        <button className={styles.generateBtn} onClick={handleGenerate}>
          Random
        </button>
      </div>

      <div className={styles.canvasWrapper}>
        {displayArray.map((val, i) => {
          let barClass = styles.default;
          if (currentState.sorted?.includes(i)) barClass = styles.sorted;
          else if (currentState.swapping?.includes(i)) barClass = styles.swapping;
          else if (currentState.comparing?.includes(i)) barClass = styles.comparing;
          return (
            <div
              key={i}
              className={`${styles.bar} ${barClass}`}
              style={{
                height: `${(val / maxVal) * 280}px`,
                width: `${barWidth}px`,
              }}
            >
              {barWidth >= 20 && <span className={styles.barValue}>{val}</span>}
            </div>
          );
        })}
      </div>

      <Controls
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onStep={stepForward}
        onReset={() => { setCurrentStep(0); setIsPlaying(false); }}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStep}
        totalSteps={steps.length}
        message={currentState.message}
        disabled={steps.length === 0}
      />

      <div className={styles.bottomPanel}>
        <ExplanationPanel algorithm={algoInfo} />
      </div>
    </div>
  );
}
