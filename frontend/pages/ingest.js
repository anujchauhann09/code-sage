import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function IngestRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const tab = router.query.tab;
    router.replace({ pathname: '/tools', query: tab ? { tab } : {} });
  }, [router.isReady]);

  return null;
}
