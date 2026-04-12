'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddBankCard() {
  const [accountNo, setAccountNo] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [payeeName, setPayeeName] = useState('');
  const [bankName, setBankName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); 
  const [messageType, setMessageType] = useState(''); 
  const router = useRouter();
const handleSubmit = async () => {
  if (!accountNo || !ifsc || !payeeName) {
    setMessageType('error');
    setMessage('Please fill all fields.');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    setMessageType('error');
    setMessage('You must be logged in.');
    return;
  }

  setLoading(true);
  setMessage('');

  try {
    const response = await fetch('/api/bank-card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ accountNo, ifsc, payeeName, bankName }),
    });

    const data = await response.json();

    if (response.ok) {
      // ✅ Show success message first
      setMessageType('success');
      setMessage('Bank card added successfully! Redirecting...');
      setAccountNo('');
      setIfsc('');
      setPayeeName('');
      setBankName('');

      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push('/bank');
      }, 1500);
    } else {
      // ❌ Failed: reset form so user can try again
      setMessageType('error');
      setMessage(data.message || 'Failed to add bank card.');
      setAccountNo('');
      setIfsc('');
      setPayeeName('');
      setBankName('');
    }
  } catch (error) {
    console.error(error);
    setMessageType('error');
    setMessage('Something went wrong.');
    setAccountNo('');
    setIfsc('');
    setPayeeName('');
    setBankName('');
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <main>
        <div className="bbc-page">
          {/* Header */}
          <header className="bbc-header">
            <button className="bbc-back" onClick={() => router.back()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <h2 className="bbc-title">Bind bank card</h2>
            <div style={{ width: 28 }} />
          </header>

          {/* Form */}
          <div className="bbc-body">
            <div className="bbc-form">
              <div className="bbc-row">
                <label className="bbc-label">AccNo</label>
                <input
                  className="bbc-input"
                  type="text"
                  placeholder="Please enter Account No"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <div className="bbc-divider" />

              <div className="bbc-row">
                <label className="bbc-label">IFSC</label>
                <input
                  className="bbc-input"
                  type="text"
                  placeholder="Please enter IFSC"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  maxLength={11}
                />
              </div>
              <div className="bbc-divider" />

              <div className="bbc-row">
                <label className="bbc-label">AccName</label>
                <input
                  className="bbc-input"
                  type="text"
                  placeholder="Please enter Payee Name"
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                />
              </div>
            </div>

            <button
              className="bbc-commit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Commit'}
            </button>

            {message && (
              <p style={{ color: messageType === 'success' ? 'green' : 'red', marginTop: '10px', fontSize: '13px' }}>
                {message}
              </p>
            )}

            <p className="bbc-warning">
              Please check the information carefully before submission, If the transfer issues occur due to incorrect information provided by user, It is the user's own responsibility
            </p>
          </div>
        </div>
      </main>

      <style jsx>{`
        .bbc-page {
          min-height: 100vh;
          background: #fff;
          max-width:480px;
          margin: 0 auto;
          font-family: sans-serif;
        }
        .bbc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fff;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .bbc-back {
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
        }
        .bbc-title {
          font-size: 17px;
          font-weight: 700;
          color: #111;
          margin: 0;
        }
        .bbc-body {
          padding: 16px;
        }
        .bbc-form {
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .bbc-row {
          display: flex;
          align-items: center;
          padding: 16px 14px;
          gap: 12px;
        }
        .bbc-label {
          font-size: 14px;
          font-weight: 500;
          color: #111;
          min-width: 70px;
        }
        .bbc-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          color: #999;
          background: transparent;
        }
        .bbc-input::placeholder {
          color: #bbb;
        }
        .bbc-divider {
          height: 1px;
          background: rgba(0,0,0,0.07);
          margin: 0 14px;
        }
        .bbc-commit-btn {
          width: 100%;
          padding: 14px 0;
          border-radius: 50px;
          border: none;
          background: #d9d9d9;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 14px;
        }
        .bbc-warning {
          font-size: 13px;
          color:black;
          line-height: 1.6;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
