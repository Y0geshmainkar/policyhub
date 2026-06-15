import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { PolicyDetail } from './pages/PolicyDetail/PolicyDetail';
import { PaymentModal } from './components/PaymentModal/PaymentModal';
import { LoadingOverlay } from './components/LoadingOverlay/LoadingOverlay';
import styles from './App.module.scss';

function App() {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.content}>
        <Sidebar />
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
