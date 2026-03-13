'use client';
import Link from 'next/link';
import styles from './page.module.css';

const categories = [
  {
    title: 'Sorting',
    description: 'Bubble, Selection, Insertion, Merge, Quick, Heap Sort',
    href: '/sorting',
    icon: '▥',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    count: 6,
  },
  {
    title: 'Searching',
    description: 'Linear, Binary, Jump, Interpolation Search',
    href: '/searching',
    icon: '🔍',
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    count: 4,
  },
  {
    title: 'Linked Lists',
    description: 'Singly, Doubly, Circular with insert, delete, search',
    href: '/linked-list',
    icon: '⟶',
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    count: 3,
  },
  {
    title: 'Stacks & Queues',
    description: 'Push, Pop, Enqueue, Dequeue, Circular Queue',
    href: '/stack-queue',
    icon: '☰',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    count: 3,
  },
  {
    title: 'Trees',
    description: 'BST, AVL, Red-Black, Trie with traversals',
    href: '/trees',
    icon: '🌲',
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    count: 5,
  },
  {
    title: 'Graphs',
    description: 'BFS, DFS, Dijkstra, Prim, Kruskal, A*, Bellman-Ford',
    href: '/graphs',
    icon: '◉',
    gradient: 'linear-gradient(135deg, #14b8a6, #22d3ee)',
    count: 8,
  },
  {
    title: 'Dynamic Programming',
    description: 'Fibonacci, Knapsack, LCS, Coin Change, Matrix Chain',
    href: '/dp',
    icon: '⊞',
    gradient: 'linear-gradient(135deg, #f43f5e, #fb923c)',
    count: 5,
  },
];

export default function Dashboard() {
  return (
    <div className={`${styles.dashboard} page-enter`}>
      <div className={styles.hero}>
        <div className={styles.heroGlow}></div>
        <h1 className={styles.heroTitle}>
          Data Structures & Algorithms
          <span className={styles.heroAccent}> Visualizer</span>
        </h1>
        <p className={styles.heroDesc}>
          Interactive step-by-step visualizations to master DSA concepts.
          Choose a topic below to begin.
        </p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>34+</span>
            <span className={styles.statLabel}>Algorithms</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>8</span>
            <span className={styles.statLabel}>Categories</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>∞</span>
            <span className={styles.statLabel}>Practice</span>
          </div>
        </div>
      </div>
      <div className={styles.grid}>
        {categories.map((cat, i) => (
          <Link key={cat.href} href={cat.href} className={styles.card} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className={styles.cardGlow} style={{ background: cat.gradient }}></div>
            <div className={styles.cardIcon} style={{ background: cat.gradient }}>
              {cat.icon}
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{cat.title}</h3>
                <span className={styles.cardBadge}>{cat.count} algos</span>
              </div>
              <p className={styles.cardDesc}>{cat.description}</p>
            </div>
            <div className={styles.cardArrow}>→</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
