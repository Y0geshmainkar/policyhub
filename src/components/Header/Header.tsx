import { Link } from 'react-router-dom';
import { LogoIcon } from '../icons/Icons';
import styles from './Header.module.scss';

interface Props {
  onMenuClick: () => void;
}

const HamburgerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export function Header({ onMenuClick }: Props) {
  return (
    <header className={styles.header}>
      {/* Hamburger left — mobile only */}
      <button
        className={styles.menuBtn}
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <HamburgerIcon />
      </button>

      <span className={styles.tagline}>Insurance Self-Service</span>

      {/* Logo right */}
      <Link to="/" className={`${styles.logo} ${styles.logoRight}`} aria-label="PolicyHub home">
        <span className={styles.logoText}>
          Policy<span>Hub</span>
        </span>
        <LogoIcon />
      </Link>
    </header>
  );
}
