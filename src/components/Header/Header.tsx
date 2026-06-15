import styles from './Header.module.scss';

export function Header() {
  return (
    <header className={styles.header}>
      <span className={styles.logo}>
        Policy<span>Hub</span>
      </span>
    </header>
  );
}
