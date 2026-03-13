import Sidebar from '@/components/Layout/Sidebar';
import { VisualizationProvider } from '@/context/VisualizationContext';

export default function MainLayout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <VisualizationProvider>
        <Sidebar />
        <main style={{
          flex: 1,
          minHeight: '100vh',
          padding: 'var(--space-lg)',
          minWidth: 0,
        }}>
          {children}
        </main>
      </VisualizationProvider>
    </div>
  );
}
