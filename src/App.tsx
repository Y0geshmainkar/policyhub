import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { PolicyDetail } from './pages/PolicyDetail/PolicyDetail';
import { PaymentModal } from './components/PaymentModal/PaymentModal';
import { LoadingOverlay } from './components/LoadingOverlay/LoadingOverlay';
import styles from './App.module.scss';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Header onMenuClick={() => setDrawerOpen(o => !o)} />

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className={styles.drawerBackdrop}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className={styles.content}>
        {/* Desktop sidebar — always visible */}
        <div className={`${styles.sidebarWrap} ${drawerOpen ? styles.drawerOpen : ''}`}>
          <Sidebar onSelect={() => setDrawerOpen(false)} />
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/policy/:id" element={<PolicyDetail />} />
        </Routes>
      </div>

      <PaymentModal />
      <LoadingOverlay />
    </div>
  );
}

export default App;
