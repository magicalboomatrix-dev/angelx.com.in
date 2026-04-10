'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Footer from '../components/footer';

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

export default function InvitePage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState('');
  const [data, setData] = useState({ inviteCode: '', inviteLink: '', inviteReward: 0 });

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    let cancelled = false;

    async function loadInviteData() {
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
          throw new Error(result.error || 'Failed to load invite data');
        }

        if (!cancelled) {
          setData({
            inviteCode: result.inviteCode || '',
            inviteLink: result.inviteLink || '',
            inviteReward: result.inviteReward || 0,
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || 'Failed to load invite data');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInviteData();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function copyText(value, field) {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(''), 1800);
    } catch {
      setCopiedField('');
    }
  }

  const qrCodeUrl = data.inviteLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(data.inviteLink)}`
    : '';

  return (
    <div>
      <main>
        <div className="page-wrappers empty-page invite-screen" style={{ height: 'auto', paddingBottom: '100px' }}>
          <div className="page-wrapperss page-wrapper-ex page-wrapper-login page-wrapper-loginacc form-wrapper invite-wrapper" style={{ height: '100%', overflow: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'transparent transparent' }}>
            <div className="brdc invite-breadcrumb">
              <div className="back-btn">
                <Link href="/mine">
                  <img src="/images/back-btn.png" alt="back" />
                </Link>
              </div>
              <h3>Invites</h3>
            </div>

            <section className="section-1s banner-imgn invite-hero">
              <div className="informate">
                <div className="full">
                  <div className="info">
                    <h3>Invite friends and make money together</h3>
                    <p>Each accepted order of your subordinates will get you corresponding rewards</p>
                    <div className="invite-reward-chip">Current reward: {formatMoney(data.inviteReward)} USDT per approved order</div>
                  </div>
                </div>
              </div>
              <div className="image">
                <img src="/images/inv-img.jpg" alt="Invite friends" style={{ width: '100%' }} />
              </div>
            </section>

            <div className="pricerefBx pricerefBx-01 invite-rules-box">
              <h4><b>Rules</b></h4>
              <table width="100%">
                <thead>
                  <tr>
                    <th>Subordinate</th>
                    <th>Commission rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>1 Level</td><td>0.1%</td></tr>
                  <tr><td>2 Level</td><td>0.03%</td></tr>
                  <tr><td>3 Level</td><td>0.02%</td></tr>
                  <tr><td>4 Level</td><td>0.01%</td></tr>
                  <tr><td>5 Level</td><td>0.01%</td></tr>
                </tbody>
              </table>
            </div>

            {error ? <p className="invite-error">{error}</p> : null}

            <div className="login-bx invite-button-row" style={{ margin: '5px 0 0 0', padding: 0 }}>
              <button className="login-btn open-btn invite-open-btn" onClick={() => setIsOpen(true)} style={{ width: '100%' }} disabled={loading || !data.inviteLink}>
                {loading ? 'Loading...' : 'Invite Friends'}
              </button>
            </div>
          </div>

          <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={() => setIsOpen(false)} />

          <div className={`popup QR-popup invite-modal ${isOpen ? 'show' : ''}`}>
            <div className="close-btn" onClick={() => setIsOpen(false)}>
              <img src="/images/close-icon.png" alt="close" />
            </div>

            <div className="img">
              {qrCodeUrl ? <img src={qrCodeUrl} alt="Invite QR code" /> : null}
            </div>
            <p>Please use mobile browser scan QR code to registration</p>

            <div className="invite-field">
              <div className="field-bx">
                <div className="left">Invite code</div>
                <div className="right">
                  <span className="code-num">{data.inviteCode || '--'}</span>
                  <button className="icon-img" type="button" onClick={() => copyText(data.inviteCode, 'code')}>
                    <img src="/images/copyicon.png" alt="copy invite code" />
                  </button>
                </div>
              </div>

              <div className="field-bx">
                <div className="left">Invite link</div>
                <div className="right">
                  <span className="code-num invite-link-text">{data.inviteLink || '--'}</span>
                  <button className="icon-img" type="button" onClick={() => copyText(data.inviteLink, 'link')}>
                    <img src="/images/copyicon.png" alt="copy invite link" />
                  </button>
                </div>
              </div>
            </div>

            {copiedField ? <div className="copy-state">{copiedField === 'code' ? 'Invite code copied' : 'Invite link copied'}</div> : null}
          </div>
        </div>

        <Footer />
      </main>

      <style jsx>{`
        .invite-screen {
          background: linear-gradient(180deg, #fff7d8 0%, #fffdfa 24%, #ffffff 58%);
        }
        .invite-wrapper {
          background: transparent;
          padding: 0 14px 28px;
        }
        .invite-breadcrumb {
          padding-top: 14px;
          margin-bottom: 6px;
        }
        .invite-hero .info {
          text-align: center;
        }
        .invite-hero .info h3 {
          font-size: 18px;
          line-height: 1.3;
          font-weight: 700;
          color: #202020;
          margin-bottom: 10px;
        }
        .invite-hero .info p {
          font-size: 14px;
          color: #666;
          line-height: 1.45;
          max-width: 320px;
          margin: 0 auto;
        }
        .invite-reward-chip {
          display: inline-flex;
          margin-top: 14px;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(255, 213, 65, 0.22);
          color: #7f5f00;
          font-size: 12px;
          font-weight: 600;
        }
        .invite-rules-box {
          margin-top: 8px;
        }
        .invite-error {
          margin: 10px 0 0;
          color: #c62828;
          font-size: 13px;
          text-align: center;
        }
        .invite-button-row {
          margin-top: 14px !important;
        }
        .invite-open-btn {
          padding: 3px 20px;
          background: transparent;
          color: #111;
          border: 0;
          cursor: pointer;
          font-weight: normal;
        }
        .invite-open-btn:disabled {
          opacity: 0.65;
          cursor: default;
        }
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
          z-index: 999;
          visibility: hidden;
        }
        .overlay.show {
          opacity: 1;
          pointer-events: auto;
          visibility: visible;
        }
        .invite-modal {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          max-width: 375px;
          margin: auto;
          background: #fff;
          border-top-left-radius: 22px;
          border-top-right-radius: 22px;
          padding: 22px 22px 28px;
          min-height: 280px;
          transform: translateY(100%);
          transition: transform 0.3s ease;
          z-index: 1000;
          box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.12);
          visibility: hidden;
        }
        .invite-modal.show {
          transform: translateY(0%);
          visibility: visible;
        }
        .invite-modal .img {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }
        .invite-modal .img img {
          width: 190px;
          height: 190px;
          object-fit: contain;
          border-radius: 8px;
        }
        .invite-modal > p {
          text-align: left;
          font-weight: 300;
          color: #000;
          font-size: 13px;
          margin-bottom: 10px;
        }
        .invite-modal .close-btn {
          position: absolute;
          top: 10px;
          right: 12px;
          margin-top: 0;
          padding: 4px;
          background: transparent;
          border: 0;
          cursor: pointer;
        }
        .invite-field {
          margin: 25px 0 10px;
          display: grid;
          gap: 12px;
        }
        .field-bx {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          background: #eeeef1;
          border-radius: 10px;
          padding: 10px;
        }
        .field-bx .right {
          display: flex;
          gap: 10px;
          align-items: center;
          min-width: 0;
          flex: 1;
          justify-content: flex-end;
        }
        .code-num {
          font-size: 14px;
          color: #4a4a4a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .invite-link-text {
          max-width: 190px;
        }
        .icon-img {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
        }
        .copy-state {
          margin-top: 14px;
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          color: #16794b;
        }
      `}</style>
    </div>
  );
}
