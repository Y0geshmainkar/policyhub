import { useRef, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Division, DIVISION_NAMES, DIVISIONS } from '../../types/policy';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveDivision } from '../../store/policiesSlice';
import styles from './Sidebar.module.scss';

export function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const activeDivision = useAppSelector(s => s.policies.activeDivision);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelect = (div: Division) => {
    dispatch(setActiveDivision(div));
    navigate('/');
  };

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    let next = index;
    if (e.key === 'ArrowDown') next = (index + 1) % DIVISIONS.length;
    else if (e.key === 'ArrowUp') next = (index - 1 + DIVISIONS.length) % DIVISIONS.length;
    else return;
    e.preventDefault();
    tabRefs.current[next]?.focus();
    handleSelect(DIVISIONS[next]);
  };

  return (
    <nav className={styles.sidebar} aria-label="Divisions">
      <ul role="tablist" aria-orientation="vertical" className={styles.tabList}>
        {DIVISIONS.map((div, i) => (
          <li key={div} role="presentation">
            <button
              role="tab"
              id={`tab-${div}`}
              aria-selected={activeDivision === div}
              aria-controls={`panel-${div}`}
              tabIndex={activeDivision === div ? 0 : -1}
              ref={el => { tabRefs.current[i] = el; }}
              className={styles.tab}
              onClick={() => handleSelect(div)}
              onKeyDown={e => handleKeyDown(e, i)}
            >
              <span className={styles.code}>{div}</span>
              {DIVISION_NAMES[div]}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
