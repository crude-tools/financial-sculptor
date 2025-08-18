import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';
import Layout from './components/core/Layout';
import Header from './components/core/header';

// CORRECTED LINES: Using a capital 'P' to match your folder
import GoalsPage from './Pages/GoalsPage';
import SplitterPage from './Pages/SplitterPage';
import StudioPage from './Pages/StudioPage';

function App() {
  const { theme, currentPage } = useContext(AppContext);

  React.useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const renderPage = () => {
    switch (currentPage) {
      case 'goals':
        return <GoalsPage />;
      case 'splitter':
        return <SplitterPage />;
      case 'studio':
        return <StudioPage />;
      default:
        return <GoalsPage />;
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto animate-fade-in">
        <Header />
        <main className="mt-8">{renderPage()}</main>
        <footer className="text-center py-6 mt-8 border-t border-white/10 text-muted-foreground text-sm">
          © 2025 Financial Sculptor. V3 Architecture.
        </footer>
      </div>
    </Layout>
  );
}

export default App;