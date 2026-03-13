'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import styles from './TreeVisualizer.module.css';
import Controls from '@/components/Controls/Controls';
import ExplanationPanel from '@/components/ExplanationPanel/ExplanationPanel';
import { BSTNode, bstInsert, bstSearch, bstDelete, avlInsert, inorder, preorder, postorder, levelOrder, TREE_INFO } from '@/algorithms/trees';
import { useAnimation } from '@/hooks/useAnimation';

function layoutTree(root) {
  const nodes = [];
  const edges = [];
  let minX = 0;

  function assignPositions(node, depth, x, parentX, parentY) {
    if (!node) return x;
    x = assignPositions(node.left, depth + 1, x, null, null);
    node.x = x;
    node.y = depth;
    nodes.push({ value: node.value, x: node.x, y: node.y, color: node.color || 'default' });
    if (parentX !== null) {
      edges.push({ x1: parentX, y1: parentY, x2: node.x, y2: node.y });
    }
    x++;
    x = assignPositions(node.right, depth + 1, x, null, null);
    return x;
  }

  function addEdges(node) {
    if (!node) return;
    if (node.left) {
      edges.push({ x1: node.x, y1: node.y, x2: node.left.x, y2: node.left.y });
      addEdges(node.left);
    }
    if (node.right) {
      edges.push({ x1: node.x, y1: node.y, x2: node.right.x, y2: node.right.y });
      addEdges(node.right);
    }
  }

  assignPositions(root, 0, 0, null, null);
  edges.length = 0;
  addEdges(root);

  return { nodes, edges };
}

const TRAVERSALS = { inorder, preorder, postorder, levelOrder };
const TREE_TYPES = ['bst', 'avl'];

export default function TreeVisualizer() {
  const [treeType, setTreeType] = useState('bst');
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [traversalResult, setTraversalResult] = useState([]);
  const stepsRef = useRef([]);

  // Initialize with some values
  useEffect(() => {
    let r = null;
    const vals = [50, 30, 70, 20, 40, 60, 80];
    vals.forEach(v => {
      if (treeType === 'avl') {
        const res = avlInsert(r, v);
        r = res.root;
      } else {
        const res = bstInsert(r, v);
        r = res.root;
      }
    });
    setRoot(r);
  }, [treeType]);

  const handleInsert = useCallback(() => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    let result;
    if (treeType === 'avl') {
      result = avlInsert(root, val);
    } else {
      result = bstInsert(root, val);
    }
    setRoot(result.root);
    stepsRef.current = result.steps;
    setSteps(result.steps);
    setCurrentStep(0);
    setHighlightedNode(null);
    setVisitedNodes([]);
    setInputValue('');
  }, [inputValue, root, treeType]);

  const handleDelete = useCallback(() => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    const result = bstDelete(root, val);
    setRoot(result.root);
    stepsRef.current = result.steps;
    setSteps(result.steps);
    setCurrentStep(0);
    setInputValue('');
  }, [inputValue, root]);

  const handleSearch = useCallback(() => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    const searchSteps = bstSearch(root, val);
    stepsRef.current = searchSteps;
    setSteps(searchSteps);
    setCurrentStep(0);
    setVisitedNodes([]);
    setHighlightedNode(null);
  }, [inputValue, root]);

  const handleTraversal = useCallback((type) => {
    const fn = TRAVERSALS[type];
    const travSteps = fn(root);
    stepsRef.current = travSteps;
    setSteps(travSteps);
    setCurrentStep(0);
    setVisitedNodes([]);
    setTraversalResult([]);
    setHighlightedNode(null);
  }, [root]);

  const stepForward = useCallback(() => {
    setCurrentStep(prev => {
      const step = stepsRef.current[prev];
      if (!step) { setIsPlaying(false); return prev; }
      if (step.nodeValue !== undefined) {
        setHighlightedNode(step.nodeValue);
        if (step.type === 'visit' || step.type === 'found') {
          setVisitedNodes(v => [...v, step.nodeValue]);
          setTraversalResult(r => [...r, step.nodeValue]);
        }
      }
      if (prev >= stepsRef.current.length - 1) { setIsPlaying(false); return prev; }
      return prev + 1;
    });
  }, []);

  useAnimation(stepForward, isPlaying, speed);

  const currentMessage = steps[currentStep]?.message || '';
  const layout = root ? layoutTree(root) : { nodes: [], edges: [] };
  const nodeSpacing = 60;
  const levelHeight = 70;
  const svgWidth = Math.max(400, (layout.nodes.length + 1) * nodeSpacing);
  const maxDepth = layout.nodes.reduce((m, n) => Math.max(m, n.y), 0);
  const svgHeight = Math.max(300, (maxDepth + 2) * levelHeight);
  const offsetX = nodeSpacing;

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Tree Visualizer</h1>
        <div className={styles.typeSelect}>
          {TREE_TYPES.map(t => (
            <button key={t} className={`${styles.typeBtn} ${treeType === t ? styles.active : ''}`}
              onClick={() => setTreeType(t)}>{TREE_INFO[t]?.name || t.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div className={styles.inputSection}>
        <input className={styles.inputField} type="number" placeholder="Value"
          value={inputValue} onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleInsert()} />
        <button className={styles.opBtn} onClick={handleInsert}>Insert</button>
        <button className={`${styles.opBtn} ${styles.danger}`} onClick={handleDelete}>Delete</button>
        <button className={`${styles.opBtn} ${styles.search}`} onClick={handleSearch}>Search</button>
        <div className={styles.travBtns}>
          {Object.keys(TRAVERSALS).map(t => (
            <button key={t} className={styles.travBtn} onClick={() => handleTraversal(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.canvas}>
        <svg width={svgWidth} height={svgHeight} className={styles.treeSvg}>
          {layout.edges.map((e, i) => (
            <line key={i}
              x1={e.x1 * nodeSpacing + offsetX} y1={e.y1 * levelHeight + 40}
              x2={e.x2 * nodeSpacing + offsetX} y2={e.y2 * levelHeight + 40}
              stroke="var(--border-primary)" strokeWidth="2" />
          ))}
          {layout.nodes.map((n, i) => {
            const isHighlighted = highlightedNode === n.value;
            const isVisited = visitedNodes.includes(n.value);
            return (
              <g key={i} transform={`translate(${n.x * nodeSpacing + offsetX}, ${n.y * levelHeight + 40})`}>
                <circle r="22"
                  fill={isHighlighted ? 'rgba(245,158,11,0.2)' : isVisited ? 'rgba(16,185,129,0.15)' : 'var(--bg-tertiary)'}
                  stroke={isHighlighted ? '#f59e0b' : isVisited ? '#10b981' : 'var(--border-primary)'}
                  strokeWidth="2"
                  className={isHighlighted ? styles.nodeGlow : ''} />
                <text textAnchor="middle" dy="5" fill="var(--text-primary)"
                  fontSize="13" fontWeight="700" fontFamily="var(--font-mono)">
                  {n.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {traversalResult.length > 0 && (
        <div className={styles.traversalResult}>
          <span className={styles.travLabel}>Traversal: </span>
          {traversalResult.map((v, i) => (
            <span key={i} className={styles.travItem}>{v}{i < traversalResult.length - 1 ? ' → ' : ''}</span>
          ))}
        </div>
      )}

      <Controls isPlaying={isPlaying} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}
        onStep={stepForward} onReset={() => { setCurrentStep(0); setIsPlaying(false); setHighlightedNode(null); setVisitedNodes([]); setTraversalResult([]); }}
        speed={speed} onSpeedChange={setSpeed} currentStep={currentStep} totalSteps={steps.length}
        message={currentMessage} disabled={steps.length === 0} />

      <ExplanationPanel algorithm={TREE_INFO[treeType]} />
    </div>
  );
}
