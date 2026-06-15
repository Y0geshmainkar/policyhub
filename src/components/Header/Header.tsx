import { Link } from 'react-router-dom';
import { LogoIcon } from '../icons/Icons';
import styles from './Header.module.scss';

export function Header() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo} aria-label="PolicyHub home">
        <LogoIcon />
        <span className={styles.logoText}>
          Policy<span>Hub</span>
        </span>
      </Link>
      <span className={styles.divider} aria-hidden />
      <span className={styles.tagline}>Insurance Self-Service</span>
      <nav className={styles.nav} aria-label="Header navigation" />
    </header>
  );
}
