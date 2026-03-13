'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './Sidebar.module.css';

const navItems = [
  { label: 'Dashboard', href: '/', icon: '⬡' },
  { section: 'Data Structures' },
  { label: 'Linked Lists', href: '/linked-list', icon: '⟶' },
  { label: 'Stacks & Queues', href: '/stack-queue', icon: '☰' },
  { label: 'Trees', href: '/trees', icon: '🌲' },
  { label: 'Graphs', href: '/graphs', icon: '◉' },
  { section: 'Algorithms' },
  { label: 'Sorting', href: '/sorting', icon: '▥' },
  { label: 'Searching', href: '/searching', icon: '🔍' },
  { label: 'Dynamic Prog.', href: '/dp', icon: '⊞' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <>
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>DS</div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>DSA Visualizer</span>
            <span className={styles.logoSub}>Interactive Learning</span>
          </div>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item, i) => {
            if (item.section) {
              return (
                <div key={i} className={styles.navSectionTitle}>
                  {item.section}
                </div>
              );
            }
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout} title="Sign out">
          <span className={styles.navIcon}>⏻</span>
          <span className={styles.navLabel}>Sign Out</span>
        </button>
        <button className={styles.toggleBtn} onClick={() => setCollapsed(c => !c)} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          <span className={`${styles.toggleArrow} ${collapsed ? styles.rotated : ''}`}>‹</span>
        </button>
      </aside>
      {/* Spacer to push main content */}
      <div className={styles.spacer} style={{ width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)' }} />
    </>
  );
}
