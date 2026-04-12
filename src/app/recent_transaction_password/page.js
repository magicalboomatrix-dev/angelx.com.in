"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function maskMobile(mobile) {
  const digits = String(mobile ?? "").replace(/\D/g, "");
  if (digits.length < 7) return mobile;
  return `${digits.slice(0, 3)}***${digits.slice(-4)}`;
}

const ResetTransactionPasswordPage = () => {
  const [timer, setTimer] = useState(60);
  const [mobile, setMobile] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data?.user?.mobile) setMobile(data.user.mobile); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', maxWidth: '380px', margin: '0 auto', padding: '24px 20px', fontFamily: 'sans-serif' }}>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', marginBottom: '28px', display: 'block' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      {/* Title */}
      <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111', marginBottom: '6px' }}>
        Reset transaction password
      </h1>
      <p style={{ fontSize: '14px', fontWeight: '700', color: '#111', marginBottom: '32px' }}>
        SMS OTP send to +91 {mobile ? maskMobile(mobile) : "822***2546"}
      </p>

      {/* OTP Input */}
      <div style={{ position: 'relative', marginBottom: '14px' }}>
        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#aaa', display: 'flex' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </span>
        <input
          type="text"
          placeholder="Please enter SMS OTP"
          style={{ width: '100%', background: '#f5f5f5', borderRadius: '50px', padding: '15px 56px 15px 46px', border: 'none', outline: 'none', fontSize: '14px', color: '#999', boxSizing: 'border-box' }}
        />
        <span style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: '13px' }}>
          {timer}s
        </span>
      </div>

      {/* Password Input */}
      <div style={{ position: 'relative', marginBottom: '10px' }}>
        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#aaa', display: 'flex' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </span>
        <input
          type="password"
          placeholder="Please enter transaction password"
          style={{ width: '100%', background: '#f5f5f5', borderRadius: '50px', padding: '15px 16px 15px 46px', border: 'none', outline: 'none', fontSize: '14px', color: '#999', boxSizing: 'border-box' }}
        />
      </div>

      <p style={{ fontSize: '12px', color: '#aaa', padding: '0 4px', lineHeight: '1.5', marginBottom: '32px' }}>
        The transaction password must be composed of 6 digits only
      </p>

      <button style={{ width: '100%', background: '#1a1a1a', color: '#fff', fontWeight: '700', fontSize: '16px', padding: '16px 0', borderRadius: '50px', border: 'none', cursor: 'pointer' }}>
        Confirm
      </button>
    </div>
  );
};

export default ResetTransactionPasswordPage;