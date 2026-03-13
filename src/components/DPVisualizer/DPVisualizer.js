'use client';
import { useState, useCallback, useRef } from 'react';
import styles from './DPVisualizer.module.css';
import Controls from '@/components/Controls/Controls';
import ExplanationPanel from '@/components/ExplanationPanel/ExplanationPanel';
import { fibonacciDP, knapsackDP, lcsDP, coinChangeDP, matrixChainDP, DP_INFO } from '@/algorithms/dp';
import { useAnimation } from '@/hooks/useAnimation';

const ALGO_KEYS = ['fibonacci', 'knapsack', 'lcs', 'coin', 'matrix'];

export default function DPVisualizer() {
  const [selectedAlgo, setSelectedAlgo] = useState('fibonacci');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [fibN, setFibN] = useState(10);
  const [lcsS1, setLcsS1] = useState('ABCBDAB');
  const [lcsS2, setLcsS2] = useState('BDCAB');
  const [coinAmount, setCoinAmount] = useState(11);
  const stepsRef = useRef([]);

  const runAlgorithm = useCallback(() => {
    let algoSteps;
    switch (selectedAlgo) {
      case 'fibonacci':
        algoSteps = fibonacciDP(fibN);
        break;
      case 'knapsack':
        algoSteps = knapsackDP([2, 3, 4, 5], [3, 4, 5, 6], 8);
        break;
      case 'lcs':
        algoSteps = lcsDP(lcsS1, lcsS2);
        break;
      case 'coin':
        algoSteps = coinChangeDP([1, 5, 6, 9], coinAmount);
        break;
      case 'matrix':
        algoSteps = matrixChainDP([10, 20, 30, 40, 30]);
        break;
      default:
        algoSteps = [];
    }
    stepsRef.current = algoSteps;
    setSteps(algoSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [selectedAlgo, fibN, lcsS1, lcsS2, coinAmount]);

  const stepForward = useCallback(() => {
    setCurrentStep(prev => {
      if (prev >= stepsRef.current.length - 1) { setIsPlaying(false); return prev; }
      return prev + 1;
    });
  }, []);

  useAnimation(stepForward, isPlaying, speed);
  const currentState = steps[currentStep] || {};

  const renderTable = () => {
    const table = currentState.table;
    if (!table) return null;
    return (
      <div className={styles.tableWrapper}>
        <table className={styles.dpTable}>
          <tbody>
            {table.map((row, i) => (
              <tr key={i}>
                {row.map((val, j) => (
                  <td key={j} className={`${styles.dpCell} 
                    ${currentState.row === i && currentState.col === j ? styles.active : ''}
                    ${currentState.match && currentState.row === i && currentState.col === j ? styles.match : ''}
                    ${val > 0 ? styles.filled : ''}
                  `}>
                    {val === Infinity ? '∞' : val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderArray = () => {
    const dp = currentState.dp;
    if (!dp) return null;
    return (
      <div className={styles.arrayWrapper}>
        {dp.map((val, i) => (
          <div key={i} className={`${styles.arrayCell}
            ${currentState.cell === i ? styles.active : ''}
            ${currentState.comparing?.includes(i) ? styles.comparing : ''}
            ${val > 0 ? styles.filled : ''}
          `}>
            <span className={styles.cellValue}>{val === Infinity ? '∞' : val}</span>
            <span className={styles.cellIndex}>{i}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dynamic Programming</h1>
        <div className={styles.algoSelect}>
          {ALGO_KEYS.map(key => (
            <button key={key} className={`${styles.algoBtn} ${selectedAlgo === key ? styles.active : ''}`}
              onClick={() => { setSelectedAlgo(key); setSteps([]); setCurrentStep(0); }}>
              {DP_INFO[key]?.name || key}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.inputSection}>
        {selectedAlgo === 'fibonacci' && (
          <input className={styles.inputField} type="number" placeholder="n" value={fibN}
            onChange={e => setFibN(Math.min(30, Math.max(2, parseInt(e.target.value) || 2)))} />
        )}
        {selectedAlgo === 'lcs' && (
          <>
            <input className={styles.inputField} placeholder="String 1" value={lcsS1}
              onChange={e => setLcsS1(e.target.value.toUpperCase())} />
            <input className={styles.inputField} placeholder="String 2" value={lcsS2}
              onChange={e => setLcsS2(e.target.value.toUpperCase())} />
          </>
        )}
        {selectedAlgo === 'coin' && (
          <input className={styles.inputField} type="number" placeholder="Amount" value={coinAmount}
            onChange={e => setCoinAmount(parseInt(e.target.value) || 1)} />
        )}
        <button className={styles.runBtn} onClick={runAlgorithm}>▶ Run</button>
      </div>

      <div className={styles.canvas}>
        {(selectedAlgo === 'fibonacci' || selectedAlgo === 'coin') && renderArray()}
        {(selectedAlgo === 'knapsack' || selectedAlgo === 'lcs' || selectedAlgo === 'matrix') && renderTable()}
        {steps.length === 0 && (
          <div className={styles.emptyText}>Click Run to start the visualization</div>
        )}
      </div>

      <Controls isPlaying={isPlaying} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}
        onStep={stepForward} onReset={() => { setCurrentStep(0); setIsPlaying(false); }}
        speed={speed} onSpeedChange={setSpeed} currentStep={currentStep} totalSteps={steps.length}
        message={currentState.message || ''} disabled={steps.length === 0} />

      <ExplanationPanel algorithm={DP_INFO[selectedAlgo]} />
    </div>
  );
}
