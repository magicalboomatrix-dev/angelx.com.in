'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Footer from '../components/footer';

function formatDate(value) {
  if (!value) {
    return '--';
  }

  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

export default function ReferralsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    totalReferrals: 0,
    rewardedReferrals: 0,
    totalRewards: 0,
    referrals: [],
  });

  useEffect(() => {
    let cancelled = false;

    async function loadReferralData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.replace('/login');
          return;
        }

        const response = await fetch('/api/referrals', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to load referral statuses');
        }

        if (!cancelled) {
          setData({
            totalReferrals: result.totalReferrals || 0,
            rewardedReferrals: result.rewardedReferrals || 0,
            totalRewards: result.totalRewards || 0,
            referrals: result.referrals || [],
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || 'Failed to load referral statuses');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadReferralData();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const stats = useMemo(() => ([
    { label: 'Total invites', value: data.totalReferrals },
    { label: 'Rewarded friends', value: data.rewardedReferrals },
    { label: 'Total rewards', value: `${formatMoney(data.totalRewards)} USDT` },
  ]), [data]);

  return (
    <div>
      <main>
        <div className="page-wrappers empty-page referral-screen" style={{ paddingBottom: '100px' }}>
          <div className="page-wrapperss page-wrapper-ex page-wrapper-login page-wrapper-loginacc form-wrapper referral-wrapper">
            <div className="brdc referral-breadcrumb">
              <div className="back-btn">
                <Link href="/mine">
                  <img src="/images/back-btn.png" alt="back" />
                </Link>
              </div>
              <h3>Referals</h3>
            </div>

            <section className="referral-summary">
              {stats.map((item) => (
                <div className="summary-card" key={item.label}>
                  <p>{item.label}</p>
                  <h4>{item.value}</h4>
                </div>
              ))}
            </section>

            {error ? <p className="referral-error">{error}</p> : null}

            <section className="referral-list">
              {loading ? (
                <div className="referral-empty">Loading referral statuses...</div>
              ) : data.referrals.length === 0 ? (
                <div className="referral-empty">No referred users yet. Share your invite link to start earning rewards.</div>
              ) : (
                data.referrals.map((referral) => (
                  <article className="referral-card" key={referral.id}>
                    <div className="referral-head">
                      <div>
                        <h4>{referral.name}</h4>
                        <p>{referral.mobile}</p>
                      </div>
                      <span className={`status-badge status-${String(referral.status || '').toLowerCase()}`}>{referral.status}</span>
                    </div>

                    <div className="referral-meta">
                      <div>
                        <span>Joined</span>
                        <strong>{formatDate(referral.joinedAt)}</strong>
                      </div>
                      <div>
                        <span>Approved orders</span>
                        <strong>{referral.successfulOrders}</strong>
                      </div>
                      <div>
                        <span>Reward earned</span>
                        <strong>{formatMoney(referral.rewardAmount)} USDT</strong>
                      </div>
                    </div>

                    <div className="referral-foot">
                      <span>Last approved: {formatDate(referral.lastApprovedAt)}</span>
                      <span>Last reward: {formatDate(referral.lastRewardAt)}</span>
                    </div>
                  </article>
                ))
              )}
            </section>
          </div>
        </div>

        <Footer />
      </main>

      <style jsx>{`
        .referral-screen {
          background: linear-gradient(180deg, #fff7d7 0%, #fffdfa 20%, #ffffff 55%);
        }
        .referral-wrapper {
          background: transparent;
          padding: 0 14px 24px;
        }
        .referral-breadcrumb {
          padding-top: 14px;
        }
        .referral-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin: 20px 0 18px;
        }
        .summary-card {
          background: #ffffff;
          border: 1px solid rgba(25, 25, 25, 0.06);
          border-radius: 16px;
          padding: 14px 10px;
          text-align: center;
          box-shadow: 0 8px 20px rgba(20, 20, 20, 0.04);
        }
        .summary-card p {
          margin: 0 0 8px;
          font-size: 12px;
          color: #7a7a7a;
        }
        .summary-card h4 {
          margin: 0;
          font-size: 16px;
          color: #1f1f1f;
          font-weight: 700;
          line-height: 1.2;
        }
        .referral-error {
          margin: 0 0 12px;
          text-align: center;
          font-size: 13px;
          color: #ca2a2a;
        }
        .referral-list {
          display: grid;
          gap: 12px;
        }
        .referral-card {
          background: #fff;
          border-radius: 18px;
          padding: 16px 14px;
          border: 1px solid rgba(20, 20, 20, 0.06);
          box-shadow: 0 10px 24px rgba(20, 20, 20, 0.05);
        }
        .referral-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }
        .referral-head h4 {
          margin: 0 0 4px;
          font-size: 15px;
          color: #1d1d1d;
          font-weight: 700;
        }
        .referral-head p {
          margin: 0;
          font-size: 12px;
          color: #7f7f7f;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 80px;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }
        .status-pending {
          background: #fff4d7;
          color: #8a6200;
        }
        .status-approved {
          background: #e9f3ff;
          color: #1858a8;
        }
        .status-rewarded {
          background: #e7f8ed;
          color: #197245;
        }
        .referral-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 12px;
        }
        .referral-meta span,
        .referral-foot span {
          display: block;
          font-size: 11px;
          color: #8a8a8a;
          margin-bottom: 4px;
        }
        .referral-meta strong {
          font-size: 13px;
          color: #202020;
        }
        .referral-foot {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(20, 20, 20, 0.06);
        }
        .referral-empty {
          background: #fff;
          border-radius: 18px;
          padding: 28px 20px;
          text-align: center;
          font-size: 14px;
          line-height: 1.6;
          color: #6f6f6f;
          border: 1px dashed rgba(20, 20, 20, 0.12);
        }
      `}</style>
    </div>
  );
}
