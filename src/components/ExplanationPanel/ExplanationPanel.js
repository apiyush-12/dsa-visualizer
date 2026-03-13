'use client';
import { useState } from 'react';
import styles from './ExplanationPanel.module.css';

export default function ExplanationPanel({ algorithm }) {
  const [activeTab, setActiveTab] = useState('info');

  if (!algorithm) return null;

  const tabs = [
    { id: 'info', label: 'Info' },
    { id: 'pseudo', label: 'Pseudocode' },
    { id: 'code', label: 'Code' },
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>{algorithm.name}</span>
        <div className={styles.tabs}>
          {tabs.map(t => (
            <button
              key={t.id}
              className={`${styles.tab} ${activeTab === t.id ? styles.active : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.body}>
        {activeTab === 'info' && (
          <>
            <p className={styles.description}>{algorithm.description}</p>
            <div className={styles.complexityGrid}>
              <div className={styles.complexityItem}>
                <span className={styles.complexityLabel}>Best Case</span>
                <span className={styles.complexityValue}>{algorithm.bestCase || '—'}</span>
              </div>
              <div className={styles.complexityItem}>
                <span className={styles.complexityLabel}>Average Case</span>
                <span className={styles.complexityValue}>{algorithm.avgCase || '—'}</span>
              </div>
              <div className={styles.complexityItem}>
                <span className={styles.complexityLabel}>Worst Case</span>
                <span className={styles.complexityValue}>{algorithm.worstCase || '—'}</span>
              </div>
              <div className={styles.complexityItem}>
                <span className={styles.complexityLabel}>Space</span>
                <span className={styles.complexityValue}>{algorithm.space || '—'}</span>
              </div>
            </div>
          </>
        )}
        {activeTab === 'pseudo' && (
          <div className={styles.pseudocode}>
            {(algorithm.pseudocode || []).map((line, i) => (
              <div
                key={i}
                className={`${styles.codeLine} ${algorithm.activeLine === i ? styles.active : ''}`}
              >
                {line}
              </div>
            ))}
          </div>
        )}
        {activeTab === 'code' && (
          <pre className={styles.codeBlock}>
            {algorithm.code || '// No code available'}
          </pre>
        )}
      </div>
    </div>
  );
}
