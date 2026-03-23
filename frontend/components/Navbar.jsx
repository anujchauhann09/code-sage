import Link from 'next/link';
import { useRouter } from 'next/router';
import ThemeToggle from './ThemeToggle';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/tools', label: 'Tools' },
  { href: '/chat', label: 'Chat' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/" className={styles.logo}>
          CodeSage
        </Link>
        <div className={styles.nav}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.navLink} ${router.pathname === href ? styles.navLinkActive : ''}`}
            >
              <span className={styles.navLinkText}>{label}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.right}>
        <ThemeToggle />
        <Link href="/chat" className={styles.chatBtn}>
          Ask AI
        </Link>
      </div>
    </nav>
  );
}
