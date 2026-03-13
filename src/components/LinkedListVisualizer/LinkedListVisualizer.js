'use client';
import { useState, useCallback, useRef } from 'react';
import styles from './LinkedListVisualizer.module.css';
import Controls from '@/components/Controls/Controls';
import { useAnimation } from '@/hooks/useAnimation';

const LL_TYPES = ['Singly', 'Doubly', 'Circular'];

function createNode(value, id) {
  return { value, id, next: null, prev: null };
}

export default function LinkedListVisualizer() {
  const [listType, setListType] = useState('Singly');
  const [nodes, setNodes] = useState([{ value: 10, id: 1 }, { value: 20, id: 2 }, { value: 30, id: 3 }]);
  const [inputValue, setInputValue] = useState('');
  const [posValue, setPosValue] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [message, setMessage] = useState('');
  const stepsRef = useRef([]);
  const nextId = useRef(4);

  const highlightTraversal = useCallback((nodeList, targetIdx, operation) => {
    const allSteps = [];
    for (let i = 0; i <= Math.min(targetIdx, nodeList.length - 1); i++) {
      allSteps.push({
        nodes: [...nodeList],
        highlighted: i,
        message: `Traversing → Node ${nodeList[i].value}`,
        operation,
      });
    }
    return allSteps;
  }, []);

  const insertAtBeginning = useCallback(() => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    const newNode = { value: val, id: nextId.current++ };
    const allSteps = [
      { nodes: [...nodes], highlighted: -1, message: `Creating node with value ${val}`, operation: 'insert' },
      { nodes: [newNode, ...nodes], highlighted: 0, message: `Inserted ${val} at beginning`, operation: 'insert' },
    ];
    stepsRef.current = allSteps;
    setSteps(allSteps);
    setCurrentStep(0);
    setNodes([newNode, ...nodes]);
    setInputValue('');
  }, [inputValue, nodes]);

  const insertAtEnd = useCallback(() => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    const newNode = { value: val, id: nextId.current++ };
    const traversalSteps = highlightTraversal(nodes, nodes.length - 1, 'insert');
    const allSteps = [
      ...traversalSteps,
      { nodes: [...nodes, newNode], highlighted: nodes.length, message: `Inserted ${val} at end`, operation: 'insert' },
    ];
    stepsRef.current = allSteps;
    setSteps(allSteps);
    setCurrentStep(0);
    setNodes([...nodes, newNode]);
    setInputValue('');
  }, [inputValue, nodes, highlightTraversal]);

  const insertAtPosition = useCallback(() => {
    const val = parseInt(inputValue);
    const pos = parseInt(posValue);
    if (isNaN(val) || isNaN(pos) || pos < 0 || pos > nodes.length) return;
    const newNode = { value: val, id: nextId.current++ };
    const traversalSteps = highlightTraversal(nodes, pos - 1, 'insert');
    const newNodes = [...nodes];
    newNodes.splice(pos, 0, newNode);
    const allSteps = [
      ...traversalSteps,
      { nodes: newNodes, highlighted: pos, message: `Inserted ${val} at position ${pos}`, operation: 'insert' },
    ];
    stepsRef.current = allSteps;
    setSteps(allSteps);
    setCurrentStep(0);
    setNodes(newNodes);
    setInputValue('');
    setPosValue('');
  }, [inputValue, posValue, nodes, highlightTraversal]);

  const deleteNode = useCallback(() => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    const idx = nodes.findIndex(n => n.value === val);
    if (idx === -1) {
      setMessage(`Value ${val} not found`);
      return;
    }
    const traversalSteps = highlightTraversal(nodes, idx, 'delete');
    const newNodes = nodes.filter((_, i) => i !== idx);
    const allSteps = [
      ...traversalSteps,
      { nodes: [...nodes], highlighted: idx, message: `Found ${val} at index ${idx}, deleting...`, operation: 'delete', deleting: idx },
      { nodes: newNodes, highlighted: -1, message: `Deleted node with value ${val}`, operation: 'delete' },
    ];
    stepsRef.current = allSteps;
    setSteps(allSteps);
    setCurrentStep(0);
    setNodes(newNodes);
    setInputValue('');
  }, [inputValue, nodes, highlightTraversal]);

  const searchNode = useCallback(() => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    const idx = nodes.findIndex(n => n.value === val);
    const traversalSteps = highlightTraversal(nodes, idx >= 0 ? idx : nodes.length - 1, 'search');
    const allSteps = [
      ...traversalSteps,
      { nodes: [...nodes], highlighted: idx, message: idx >= 0 ? `Found ${val} at index ${idx}!` : `${val} not found`, operation: 'search', found: idx },
    ];
    stepsRef.current = allSteps;
    setSteps(allSteps);
    setCurrentStep(0);
  }, [inputValue, nodes, highlightTraversal]);

  const stepForward = useCallback(() => {
    setCurrentStep(prev => {
      if (prev >= stepsRef.current.length - 1) { setIsPlaying(false); return prev; }
      return prev + 1;
    });
  }, []);

  useAnimation(stepForward, isPlaying, speed);

  const currentState = steps[currentStep] || { nodes, highlighted: -1, message: '', operation: '' };
  const displayNodes = currentState.nodes || nodes;

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Linked List Visualizer</h1>
        <div className={styles.typeSelect}>
          {LL_TYPES.map(t => (
            <button key={t} className={`${styles.typeBtn} ${listType === t ? styles.active : ''}`}
              onClick={() => setListType(t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className={styles.inputSection}>
        <input className={styles.inputField} type="number" placeholder="Value"
          value={inputValue} onChange={e => setInputValue(e.target.value)} />
        <input className={styles.inputField} type="number" placeholder="Position (optional)"
          value={posValue} onChange={e => setPosValue(e.target.value)} style={{ maxWidth: 140 }} />
        <button className={styles.opBtn} onClick={insertAtBeginning}>Insert Begin</button>
        <button className={styles.opBtn} onClick={insertAtEnd}>Insert End</button>
        <button className={styles.opBtn} onClick={insertAtPosition}>Insert At</button>
        <button className={`${styles.opBtn} ${styles.danger}`} onClick={deleteNode}>Delete</button>
        <button className={`${styles.opBtn} ${styles.search}`} onClick={searchNode}>Search</button>
      </div>

      <div className={styles.canvas}>
        <div className={styles.nodeContainer}>
          {displayNodes.map((node, i) => (
            <div key={node.id} className={styles.nodeGroup}>
              <div className={`${styles.node} 
                ${currentState.highlighted === i ? styles.highlighted : ''}
                ${currentState.deleting === i ? styles.deleting : ''}
                ${currentState.found === i ? styles.found : ''}
              `}>
                {listType === 'Doubly' && <div className={styles.prevPtr}>←</div>}
                <div className={styles.nodeValue}>{node.value}</div>
                <div className={styles.nodeIndex}>idx: {i}</div>
              </div>
              {i < displayNodes.length - 1 && (
                <div className={styles.arrow}>
                  <div className={styles.arrowLine}></div>
                  <div className={styles.arrowHead}>▶</div>
                </div>
              )}
              {listType === 'Circular' && i === displayNodes.length - 1 && displayNodes.length > 1 && (
                <div className={styles.circularArrow}>↩ HEAD</div>
              )}
            </div>
          ))}
          {displayNodes.length === 0 && <div className={styles.emptyText}>Empty List — Insert a node to begin</div>}
        </div>
        <div className={styles.headLabel}>HEAD</div>
      </div>

      <Controls isPlaying={isPlaying} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}
        onStep={stepForward} onReset={() => { setCurrentStep(0); setIsPlaying(false); }}
        speed={speed} onSpeedChange={setSpeed} currentStep={currentStep} totalSteps={steps.length}
        message={currentState.message || message} disabled={steps.length === 0} />
    </div>
  );
}
