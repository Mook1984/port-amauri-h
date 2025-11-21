import './reset.css';
import { Homepage } from './pages/homepage';
import AdmissionsPage from './pages/admissions';
import AnalyticsPage from './pages/analytics';
import React, { useEffect, useRef, useState } from 'react';

function App() {
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState(typeof window !== 'undefined' ? window.location.pathname : '/');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const hide = () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setLoading(false);
    };

    const showTemporary = (ms = 600) => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setLoading(true);
      timerRef.current = window.setTimeout(() => {
        setLoading(false);
        timerRef.current = null;
      }, ms);
    };

    const onHashChange = () => {
      // in-page section navigation
      showTemporary(600);
    };

    const onPopState = () => {
      // back/forward navigation
      setPath(window.location.pathname);
      showTemporary(400);
    };

    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      // ignore modified clicks, downloads, non-self targets
      if (e.defaultPrevented) return;
      if (anchor.hasAttribute('download')) return;
      if (anchor.target && anchor.target !== '' && anchor.target !== '_self') return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const url = new URL(anchor.href, window.location.href);

      // external links -> let the browser handle it
      if (url.origin !== window.location.origin) return;

      // same-page hash change
      if (url.pathname === window.location.pathname && url.hash) {
        e.preventDefault();
        window.history.pushState({}, '', url.pathname + url.search + url.hash);
        showTemporary(600);
        return;
      }

      // internal path navigation (SPA)
      if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
        e.preventDefault();
        window.history.pushState({}, '', url.pathname + url.search + url.hash);
        setPath(url.pathname); // trigger re-render
        showTemporary(600);
      }
    };

    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onPopState);
    document.addEventListener('click', onDocClick, true);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', onPopState);
      document.removeEventListener('click', onDocClick, true);
      hide();
    };
  }, []);

  // route by current path
  const page = path.startsWith('/admissions') ? (
    <AdmissionsPage />
  ) : path.startsWith('/analytics') || path.startsWith('/teams') ? (
    <AnalyticsPage />
  ) : (
    <Homepage />
  );

  return (
    <>
      {page}
      {loading && <LoadingOverlay />}
    </>
  );
}

function LoadingOverlay() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: '3px solid #999',
          borderTopColor: '#111',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default App;
