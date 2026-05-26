import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import './App.css';

// --- DYNAMIC PAGE REGISTRATION ---
// Eagerly scan and load all pages from the ./pages/ directory
const pageModules = import.meta.glob('./pages/*.jsx', { eager: true });

const pages = Object.keys(pageModules)
  .map((path) => {
    const mod = pageModules[path];
    const component = mod.default;
    if (!component || !component.config) {
      console.warn(`Page component at ${path} is missing static config on its default export.`);
      return null;
    }
    return {
      ...component.config,
      component,
    };
  })
  .filter(Boolean)
  .sort((a, b) => (a.order || 99) - (b.order || 99));

const defaultTab = pages.length > 0 ? pages[0].id : '';

// --- SIDEBAR COMPONENT ---
const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>PulseAI</h1>
      </div>
      <nav className="sidebar-nav">
        {pages.map((page) => {
          const Icon = page.icon;
          return (
            <button
              key={page.id}
              className={`nav-item ${activeTab === page.id ? 'active' : ''}`}
              onClick={() => setActiveTab(page.id)}
            >
              {Icon && <Icon size={18} />}
              {page.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemDark ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const activePage = pages.find((p) => p.id === activeTab) || pages[0];
  const ActiveComponent = activePage ? activePage.component : null;
  const activeTitle = activePage ? activePage.title : '';

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <header className="top-header">
          <h2 className="header-title">{activeTitle}</h2>
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme} 
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </header>
        
        {ActiveComponent ? (
          <ActiveComponent setActiveTab={setActiveTab} />
        ) : (
          <div className="content-wrapper">
            <div className="card">
              <p style={{ color: 'var(--text-secondary)' }}>No pages found.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
