'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import styles from './GraphVisualizer.module.css';
import Controls from '@/components/Controls/Controls';
import ExplanationPanel from '@/components/ExplanationPanel/ExplanationPanel';
import { bfs, dfs, dijkstra, primMST, kruskalMST, topologicalSort, bellmanFord, GRAPH_INFO } from '@/algorithms/graphs';
import { useAnimation } from '@/hooks/useAnimation';

const ALGO_KEYS = ['bfs', 'dfs', 'dijkstra', 'prim', 'kruskal', 'topological', 'bellmanFord'];
const ALGO_FUNS = { bfs, dfs, dijkstra, prim: primMST, kruskal: kruskalMST, topological: topologicalSort, bellmanFord };

const DEFAULT_NODES = [
  { id: 'A', x: 150, y: 80 }, { id: 'B', x: 80, y: 200 }, { id: 'C', x: 220, y: 200 },
  { id: 'D', x: 50, y: 320 }, { id: 'E', x: 160, y: 320 }, { id: 'F', x: 300, y: 320 },
  { id: 'G', x: 380, y: 200 },
];

const DEFAULT_EDGES = [
  { from: 'A', to: 'B', weight: 4 }, { from: 'A', to: 'C', weight: 2 },
  { from: 'B', to: 'D', weight: 5 }, { from: 'B', to: 'E', weight: 10 },
  { from: 'C', to: 'E', weight: 3 }, { from: 'C', to: 'F', weight: 8 },
  { from: 'C', to: 'G', weight: 2 }, { from: 'E', to: 'F', weight: 1 },
];

function buildAdjList(nodes, edges) {
  const graph = {};
  nodes.forEach(n => { graph[n.id] = []; });
  edges.forEach(e => {
    graph[e.from].push({ node: e.to, weight: e.weight });
    graph[e.to].push({ node: e.from, weight: e.weight });
  });
  return graph;
}

export default function GraphVisualizer() {
  const [nodes, setNodes] = useState(DEFAULT_NODES);
  const [edges, setEdges] = useState(DEFAULT_EDGES);
  const [selectedAlgo, setSelectedAlgo] = useState('bfs');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [addingEdge, setAddingEdge] = useState(null);
  const [dragging, setDragging] = useState(null);
  const stepsRef = useRef([]);
  const svgRef = useRef(null);
  const nextNodeId = useRef('H');

  const handleSvgClick = useCallback((e) => {
    if (addingEdge) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = nextNodeId.current;
    nextNodeId.current = String.fromCharCode(nextNodeId.current.charCodeAt(0) + 1);
    setNodes(prev => [...prev, { id, x, y }]);
  }, [addingEdge]);

  const handleNodeClick = useCallback((nodeId, e) => {
    e.stopPropagation();
    if (addingEdge) {
      if (addingEdge !== nodeId) {
        const exists = edges.some(e => (e.from === addingEdge && e.to === nodeId) || (e.from === nodeId && e.to === addingEdge));
        if (!exists) {
          setEdges(prev => [...prev, { from: addingEdge, to: nodeId, weight: Math.floor(Math.random() * 10) + 1 }]);
        }
      }
      setAddingEdge(null);
    } else {
      setAddingEdge(nodeId);
    }
  }, [addingEdge, edges]);

  const handleNodeMouseDown = useCallback((nodeId, e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setDragging(nodeId);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setNodes(prev => prev.map(n => n.id === dragging ? { ...n, x, y } : n));
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const runAlgorithm = useCallback(() => {
    const graph = buildAdjList(nodes, edges);
    const startNode = nodes[0]?.id;
    if (!startNode) return;
    const fn = ALGO_FUNS[selectedAlgo];
    let algoSteps;
    if (selectedAlgo === 'kruskal') {
      algoSteps = fn(graph);
    } else {
      algoSteps = fn(graph, startNode);
    }
    stepsRef.current = algoSteps;
    setSteps(algoSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [nodes, edges, selectedAlgo]);

  const stepForward = useCallback(() => {
    setCurrentStep(prev => {
      if (prev >= stepsRef.current.length - 1) { setIsPlaying(false); return prev; }
      return prev + 1;
    });
  }, []);

  useAnimation(stepForward, isPlaying, speed);

  const currentState = steps[currentStep] || {};
  const visitedNodes = currentState.visited || new Set();
  const currentNode = currentState.current;
  const currentEdge = currentState.edge;
  const mstEdges = currentState.mstEdges || [];

  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Graph Algorithms</h1>
        <div className={styles.algoSelect}>
          {ALGO_KEYS.map(key => (
            <button key={key} className={`${styles.algoBtn} ${selectedAlgo === key ? styles.active : ''}`}
              onClick={() => setSelectedAlgo(key)}>
              {GRAPH_INFO[key]?.name || key}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.toolbar}>
        <button className={styles.runBtn} onClick={runAlgorithm}>▶ Run {GRAPH_INFO[selectedAlgo]?.name}</button>
        <button className={styles.toolBtn} onClick={() => { setNodes(DEFAULT_NODES); setEdges(DEFAULT_EDGES); setSteps([]); setCurrentStep(0); }}>Reset Graph</button>
        <button className={styles.toolBtn} onClick={() => { setNodes([]); setEdges([]); setSteps([]); setCurrentStep(0); nextNodeId.current = 'A'; }}>Clear All</button>
        <span className={styles.hint}>
          {addingEdge ? `Click another node to connect from ${addingEdge}` : 'Click canvas to add nodes • Click node to start edge'}
        </span>
      </div>

      <div className={styles.canvas} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        <svg ref={svgRef} width="100%" height="450" onClick={handleSvgClick} className={styles.graphSvg}>
          {/* Edges */}
          {edges.map((e, i) => {
            const from = nodeMap[e.from];
            const to = nodeMap[e.to];
            if (!from || !to) return null;
            const isMST = mstEdges.some(m => (m[0] === e.from && m[1] === e.to) || (m[0] === e.to && m[1] === e.from));
            const isActive = currentEdge && ((currentEdge[0] === e.from && currentEdge[1] === e.to) || (currentEdge[0] === e.to && currentEdge[1] === e.from));
            return (
              <g key={`e-${i}`}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={isActive ? '#f59e0b' : isMST ? '#10b981' : 'rgba(148,163,184,0.3)'}
                  strokeWidth={isActive ? 3 : isMST ? 2.5 : 1.5} />
                <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 8}
                  fill="var(--text-muted)" fontSize="10" textAnchor="middle" fontWeight="600" fontFamily="var(--font-mono)">
                  {e.weight}
                </text>
              </g>
            );
          })}
          {/* Nodes */}
          {nodes.map((n) => {
            const isVisited = visitedNodes.has(n.id);
            const isCurrent = currentNode === n.id;
            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`} style={{ cursor: dragging === n.id ? 'grabbing' : 'grab' }}
                onClick={(e) => handleNodeClick(n.id, e)} onMouseDown={(e) => handleNodeMouseDown(n.id, e)}>
                <circle r="22"
                  fill={isCurrent ? 'rgba(245,158,11,0.25)' : isVisited ? 'rgba(16,185,129,0.2)' : 'var(--bg-tertiary)'}
                  stroke={isCurrent ? '#f59e0b' : isVisited ? '#10b981' : addingEdge === n.id ? '#8b5cf6' : 'var(--border-primary)'}
                  strokeWidth="2.5"
                  className={isCurrent ? styles.nodeGlow : ''} />
                <text textAnchor="middle" dy="5" fill="var(--text-primary)" fontSize="13" fontWeight="700" fontFamily="var(--font-mono)">
                  {n.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {currentState.dist && (
        <div className={styles.distTable}>
          <span className={styles.distLabel}>Distances: </span>
          {Object.entries(currentState.dist).map(([k, v]) => (
            <span key={k} className={styles.distItem}>{k}={v === Infinity ? '∞' : v} </span>
          ))}
        </div>
      )}

      <Controls isPlaying={isPlaying} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}
        onStep={stepForward} onReset={() => { setCurrentStep(0); setIsPlaying(false); }}
        speed={speed} onSpeedChange={setSpeed} currentStep={currentStep} totalSteps={steps.length}
        message={currentState.message || ''} disabled={steps.length === 0} />

      <ExplanationPanel algorithm={GRAPH_INFO[selectedAlgo]} />
    </div>
  );
}
