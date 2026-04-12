'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '../components/footer';

export default function ReferralsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.replace('/login'); return; }

    fetch('/api/referrals', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
      .then((r) => r.ok ? r.json() : { referrals: [] })
      .then((data) => setReferrals(data.referrals || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div>
      <main >
        <div className="ref-page">
          {/* Back button on white */}
          <div className="ref-topbar">
            <button className="ref-back" onClick={() => router.back()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
          </div>

          {/* Banner */}
          <div className="ref-banner">
            <img src="/images/ref-img.jpg" alt="My Referrals" className="ref-banner-img" />
          </div>

          {/* Content */}
          <div className="ref-content">
            {loading ? null : referrals.length === 0 ? (
              <div className="ref-empty">
                <img src="/images/empty.jpg" alt="Empty" />
              </div>
            ) : (
              referrals.map((r) => (
                <div className="ref-card" key={r.id}>
                  <p>{r.mobile}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <Footer />
      </main>

      <style jsx>{`
        .ref-page {
          min-height: 100vh;
          max-width: 100%;
          width: 100%;
          background: #fff;
          padding-bottom: 80px;
        }
        .ref-topbar {
          background: #fff;
          padding: 14px 14px 10px;
        }
        .ref-back {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
        }
        .ref-banner {
          width: 100%;
        }
        .ref-banner-img {
          width: 100%;
          display: block;
        }
        .ref-content {
          background: #fff;
        }
        .ref-empty {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 60px 20px;
        }
        .ref-empty img {
          width: 180px;
        }
        .ref-card {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          font-size: 14px;
          color: #222;
        }
      `}</style>
    </div>
  );
}
