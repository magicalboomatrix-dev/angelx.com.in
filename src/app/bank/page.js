"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BankPage() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) { router.replace("/login"); return; }

    fetch("/api/bank-card", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : { banks: [] })
      .then((data) => setBanks(data.banks || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("/api/bank-card", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      if (res.ok) setBanks((prev) => prev.filter((b) => b.id !== id));
    } catch {}
  };

  function formatDate(val) {
    if (!val) return "";
    const d = new Date(val);
    const day = String(d.getDate()).padStart(2, "0");
    const mon = d.toLocaleString("en-GB", { month: "short" });
    const yr = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${day} ${mon} ${yr} ${hh}:${mm}:${ss}`;
  }

  function getInitial(name) {
    return name ? name.trim()[0].toUpperCase() : "?";
  }

  return (
    <div>
      <main>
        <div className="ba-page">
          <header className="ba-header">
            <button className="ba-back" onClick={() => router.back()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <h2 className="ba-title">Bank account</h2>
            <div style={{ width: 28 }} />
          </header>

          <div className="ba-body">
            {loading ? null : banks.length === 0 ? (
              <p className="ba-no-data">No bank accounts added yet.</p>
            ) : (
              banks.map((bank) => (
                <div className="ba-card" key={bank.id}>
                  <div className="ba-card-top">
                    <div className="ba-avatar">{getInitial(bank.payeeName)}</div>
                    <div className="ba-info">
                      <p className="ba-info-line"><strong>Account No: {bank.accountNo}</strong></p>
                      <p className="ba-info-line">IFSC: {bank.ifsc}</p>
                      <p className="ba-info-line">Account Name: {bank.payeeName}</p>
                    </div>
                  </div>
                  <div className="ba-card-bottom">
                    <span className="ba-time">Create time: {formatDate(bank.createdAt)}</span>
                    <button className="ba-delete" onClick={() => handleDelete(bank.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" /><path d="M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
            {!loading && banks.length > 0 && (
              <p className="ba-no-more">No more data</p>
            )}
          </div>

          <div className="ba-footer">
            <Link href="/bind-bank-card" className="ba-add-btn" style={{background:'#000',color:'#fff',display:'block',textAlign:'center',textDecoration:'none',padding:'15px 0',borderRadius:'50px',fontWeight:'600',fontSize:'16px'}}>+Add bank account</Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        .ba-page {
          min-height: 100vh;
          background: #f7f9fc;
          font-family: sans-serif;
          display: flex;
           max-width:480px;
          margin: 0 auto;
          flex-direction: column;
          position: relative;
        }
        .ba-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fff;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .ba-back {
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
        }
        .ba-title {
          font-size: 17px;
          font-weight: 700;
          color: #111;
          margin: 0;
        }
        .ba-body {
          flex: 1;
          padding: 14px 12px 100px;
        }
        .ba-card {
          background: #fff;
          border-radius: 10px;
          margin-bottom: 12px;
          overflow: hidden;
        }
        .ba-card-top {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 14px 10px;
        }
        .ba-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #c084d6;
          color: #fff;
          font-size: 18px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ba-info {
          flex: 1;
        }
        .ba-info-line {
          margin: 0 0 3px;
          font-size: 13px;
          color: #333;
          line-height: 1.5;
        }
        .ba-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px 10px;
          border-top: 1px solid rgba(0,0,0,0.06);
        }
        .ba-time {
          font-size: 12px;
          color: #aaa;
        }
        .ba-delete {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
        }
        .ba-no-more {
          text-align: center;
          font-size: 13px;
          color: #bbb;
          padding: 10px 0 0;
        }
        .ba-no-data {
          text-align: center;
          font-size: 13px;
          color: #aaa;
          padding: 40px 0;
        }
        .ba-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 12px 16px 24px;
          background: #f5f5f5;
        }
        .ba-add-btn {
          display: block;
          width: 100%;
          text-align: center;
          background: #000 !important;
          color: #fff !important;
          font-size: 16px;
          font-weight: 600;
          padding: 15px 0;
          border-radius: 50px;
          text-decoration: none;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
