'use client';
import { useState, useCallback } from 'react';
import styles from './StackQueueVisualizer.module.css';

export default function StackQueueVisualizer() {
  const [mode, setMode] = useState('stack');
  const [stack, setStack] = useState([30, 20, 10]);
  const [queue, setQueue] = useState([10, 20, 30]);
  const [circularQueue, setCircularQueue] = useState({ items: Array(8).fill(null), front: -1, rear: -1, size: 8 });
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [animating, setAnimating] = useState(null);
  const [peekIdx, setPeekIdx] = useState(-1);

  // Stack operations
  const stackPush = useCallback(() => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    setAnimating('push');
    setStack(prev => [...prev, val]);
    setMessage(`Pushed ${val} onto stack (top)`);
    setInputValue('');
    setTimeout(() => setAnimating(null), 400);
  }, [inputValue]);

  const stackPop = useCallback(() => {
    if (stack.length === 0) { setMessage('Stack is empty!'); return; }
    setAnimating('pop');
    const val = stack[stack.length - 1];
    setTimeout(() => {
      setStack(prev => prev.slice(0, -1));
      setMessage(`Popped ${val} from stack`);
      setAnimating(null);
    }, 300);
  }, [stack]);

  const stackPeek = useCallback(() => {
    if (stack.length === 0) { setMessage('Stack is empty!'); return; }
    setPeekIdx(stack.length - 1);
    setMessage(`Peek: top element is ${stack[stack.length - 1]}`);
    setTimeout(() => setPeekIdx(-1), 1500);
  }, [stack]);

  // Queue operations
  const enqueue = useCallback(() => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    setAnimating('enqueue');
    setQueue(prev => [...prev, val]);
    setMessage(`Enqueued ${val} (rear)`);
    setInputValue('');
    setTimeout(() => setAnimating(null), 400);
  }, [inputValue]);

  const dequeue = useCallback(() => {
    if (queue.length === 0) { setMessage('Queue is empty!'); return; }
    setAnimating('dequeue');
    const val = queue[0];
    setTimeout(() => {
      setQueue(prev => prev.slice(1));
      setMessage(`Dequeued ${val} (front)`);
      setAnimating(null);
    }, 300);
  }, [queue]);

  const queueFront = useCallback(() => {
    if (queue.length === 0) { setMessage('Queue is empty!'); return; }
    setPeekIdx(0);
    setMessage(`Front element is ${queue[0]}`);
    setTimeout(() => setPeekIdx(-1), 1500);
  }, [queue]);

  // Circular Queue operations
  const cqEnqueue = useCallback(() => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    const cq = { ...circularQueue };
    const nextRear = (cq.rear + 1) % cq.size;
    if (cq.front === nextRear) { setMessage('Circular Queue is full!'); return; }
    if (cq.front === -1) cq.front = 0;
    cq.rear = nextRear;
    cq.items = [...cq.items];
    cq.items[cq.rear] = val;
    setCircularQueue(cq);
    setMessage(`Enqueued ${val} at position ${cq.rear}`);
    setInputValue('');
  }, [inputValue, circularQueue]);

  const cqDequeue = useCallback(() => {
    const cq = { ...circularQueue };
    if (cq.front === -1) { setMessage('Circular Queue is empty!'); return; }
    const val = cq.items[cq.front];
    cq.items = [...cq.items];
    cq.items[cq.front] = null;
    if (cq.front === cq.rear) { cq.front = -1; cq.rear = -1; }
    else cq.front = (cq.front + 1) % cq.size;
    setCircularQueue(cq);
    setMessage(`Dequeued ${val}`);
  }, [circularQueue]);

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Stack & Queue Visualizer</h1>
        <div className={styles.modeSelect}>
          {['stack', 'queue', 'circular'].map(m => (
            <button key={m} className={`${styles.modeBtn} ${mode === m ? styles.active : ''}`}
              onClick={() => { setMode(m); setMessage(''); }}>
              {m === 'circular' ? 'Circular Queue' : m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.inputSection}>
        <input className={styles.inputField} type="number" placeholder="Value"
          value={inputValue} onChange={e => setInputValue(e.target.value)} />
        {mode === 'stack' && (
          <>
            <button className={styles.opBtn} onClick={stackPush}>Push</button>
            <button className={`${styles.opBtn} ${styles.danger}`} onClick={stackPop}>Pop</button>
            <button className={`${styles.opBtn} ${styles.info}`} onClick={stackPeek}>Peek</button>
          </>
        )}
        {mode === 'queue' && (
          <>
            <button className={styles.opBtn} onClick={enqueue}>Enqueue</button>
            <button className={`${styles.opBtn} ${styles.danger}`} onClick={dequeue}>Dequeue</button>
            <button className={`${styles.opBtn} ${styles.info}`} onClick={queueFront}>Front</button>
          </>
        )}
        {mode === 'circular' && (
          <>
            <button className={styles.opBtn} onClick={cqEnqueue}>Enqueue</button>
            <button className={`${styles.opBtn} ${styles.danger}`} onClick={cqDequeue}>Dequeue</button>
          </>
        )}
      </div>

      <div className={styles.canvas}>
        {mode === 'stack' && (
          <div className={styles.stackContainer}>
            <div className={styles.stackLabel}>TOP ↓</div>
            {[...stack].reverse().map((val, i) => {
              const realIdx = stack.length - 1 - i;
              return (
                <div key={`${realIdx}-${val}`} className={`${styles.stackItem}
                  ${i === 0 && animating === 'push' ? styles.pushAnim : ''}
                  ${i === 0 && animating === 'pop' ? styles.popAnim : ''}
                  ${peekIdx === realIdx ? styles.peek : ''}
                `}>
                  <span className={styles.itemValue}>{val}</span>
                  {i === 0 && <span className={styles.topBadge}>TOP</span>}
                </div>
              );
            })}
            {stack.length === 0 && <div className={styles.emptyText}>Empty Stack</div>}
            <div className={styles.stackBase}>BOTTOM</div>
          </div>
        )}

        {mode === 'queue' && (
          <div className={styles.queueContainer}>
            <div className={styles.queueLabels}>
              <span className={styles.frontLabel}>FRONT →</span>
              <span className={styles.rearLabel}>← REAR</span>
            </div>
            <div className={styles.queueItems}>
              {queue.map((val, i) => (
                <div key={`${i}-${val}`} className={`${styles.queueItem}
                  ${i === queue.length - 1 && animating === 'enqueue' ? styles.pushAnim : ''}
                  ${i === 0 && animating === 'dequeue' ? styles.popAnim : ''}
                  ${peekIdx === i ? styles.peek : ''}
                `}>
                  <span className={styles.itemValue}>{val}</span>
                </div>
              ))}
              {queue.length === 0 && <div className={styles.emptyText}>Empty Queue</div>}
            </div>
          </div>
        )}

        {mode === 'circular' && (
          <div className={styles.circularContainer}>
            <div className={styles.circularRing}>
              {circularQueue.items.map((val, i) => {
                const angle = (i / circularQueue.size) * 360 - 90;
                const rad = (angle * Math.PI) / 180;
                const r = 120;
                const x = Math.cos(rad) * r;
                const y = Math.sin(rad) * r;
                const isFront = circularQueue.front === i;
                const isRear = circularQueue.rear === i;
                return (
                  <div key={i} className={`${styles.circularItem}
                    ${val !== null ? styles.filled : ''}
                    ${isFront ? styles.front : ''}
                    ${isRear ? styles.rear : ''}
                  `} style={{ transform: `translate(${x}px, ${y}px)` }}>
                    <span className={styles.circValue}>{val !== null ? val : ''}</span>
                    <span className={styles.circIdx}>{i}</span>
                    {isFront && <span className={styles.circBadge}>F</span>}
                    {isRear && <span className={styles.circBadge}>R</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
}
