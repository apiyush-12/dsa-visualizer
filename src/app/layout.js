import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'DSA Visualizer — Interactive Data Structures & Algorithms',
  description: 'Learn algorithms by visualizing them step-by-step with animations and interactive controls.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
