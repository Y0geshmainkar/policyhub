import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { PolicyDetail } from './pages/PolicyDetail/PolicyDetail';
import { Register } from './pages/Register/Register';
import { PaymentModal } from './components/PaymentModal/PaymentModal';
import { LoadingOverlay } from './components/LoadingOverlay/LoadingOverlay';
import styles from './App.module.scss';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Routes>
      {/* Register is full-page — no Header/Sidebar */}
      <Route path="/register" element={<Register />} />

      <Route path="*" element={
        <div className={styles.layout}>
          <Header onMenuClick={() => setDrawerOpen(o => !o)} />

          {drawerOpen && (
            <div
              className={styles.drawerBackdrop}
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
          )}

          <div className={styles.content}>
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
      } />
    </Routes>
  );
}

export default App;
