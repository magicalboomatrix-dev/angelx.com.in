"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function maskDepositId(id) {
  const padded = String(id).padStart(7, "0");
  const last4 = padded.slice(-4);
  return `TC20****${last4}`;
}

function formatDateTime(dateStr) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function DepositHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/deposit-history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        // Using sample data if empty for visual testing purposes
        setHistory(data.history?.length ? data.history : []);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  return (
    <>
      <div className="dh-page">
        {/* Header */}
        <div className="dh-header">
          <Link href="/USDT-deposit" className="dh-back">
            <img src="/images/back-btn.png" alt="back" />
          </Link>
          <span className="dh-title">Deposit History</span>
          <span className="dh-header-spacer" />
        </div>

        {/* List */}
        <div className="dh-list">
          {loading ? (
            <div className="dh-center">Loading...</div>
          ) : history.length === 0 ? (
            <div className="dh-center">
              <img src="/images/empty.jpg" alt="No records" className="dh-empty-img" />
              <p>No deposit records found</p>
            </div>
          ) : (
            history.map((tx, i) => {
              if (!tx) return null;
              const numericPart = tx.id ? String(tx.id) : (tx.referenceId || "").replace(/\D/g, "") || "5376";
              const displayId = maskDepositId(numericPart);
              const network = tx.network === "BANK" ? "TRC20" : (tx.network || "TRC20");
              const currency = tx.currency || "USDT";
              const isSuccess = tx.status === "SUCCESS";
              const isFailed = tx.status === "FAILED" || tx.status === "REJECTED";
              const statusLabel = isSuccess ? "Finish" : isFailed ? "Failed" : "Pending";

              return (
                <div
                  className="dh-card"
                  key={tx.id || i}
                  onClick={() => router.push(`/deposit-detail/${tx.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  
                  {/* Card top row */}
                  <div className="dh-card-header">
                    <div className="dh-card-left">
                      <div className="dh-file-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                      </div>
                      <span className="dh-id">{displayId}</span>
                    </div>
                    <span className={`dh-status ${isSuccess ? "dh-finish" : isFailed ? "dh-failed" : "dh-pending"}`}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Thin Divider Line */}
                  <div className="dh-divider"></div>

                  {/* Gray info section */}
                  <div className="dh-info">
                    <div className="dh-row">
                      <span className="dh-label">Network</span>
                      <div className="dh-value">
                        {/* Red TRC20 Icon SVG */}
                        <svg className="dh-net-icon" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="12" fill="#E42D36"/>
                          <path d="M12 5.5L7 14h3.5v4.5L16 11h-4L12 5.5z" fill="white"/>
                        </svg>
                        <span>{currency}-{network}</span>
                      </div>
                    </div>
                    <div className="dh-row">
                      <span className="dh-label">Create time</span>
                      <span className="dh-value">{formatDateTime(tx.createdAt)}</span>
                    </div>
                  </div>

                  {/* Amount Section (Outside Gray Box) */}
                  <div className="dh-amount-section">
                    <span className="dh-amount-label">Amount</span>
                    <span className="dh-usdt-badge">&#x20AE;</span>
                    <span className="dh-amount-val">{tx.amount ?? "10"}</span>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>

      <style jsx global>{`
        .dh-page {
          min-height: 100vh;
          background: #f7f8fa;
          font-family: system-ui, -apple-system, sans-serif;
          max-width: 480px;
          margin: 0 auto;
        }
        .dh-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fff;
          padding: 15px 16px;
          position: sticky;
          top: 0;
          z-index: 10;
          border-bottom: 1px solid #efefef;
        }
        .dh-back {
          display: flex;
          align-items: center;
          width: 24px;
        }
        .dh-back img {
          width: 18px;
          height: 18px;
        }
        .dh-title {
          font-size: 16px;
          font-weight: 700;
          color: #111;
          text-align: center;
          flex: 1;
        }
        .dh-header-spacer {
          width: 24px;
        }
        .dh-list {
          padding: 14px 16px 30px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .dh-center {
          text-align: center;
          padding: 60px 0;
          color: #aaa;
          font-size: 14px;
        }
        .dh-empty-img {
          width: 110px;
          opacity: 0.5;
          display: block;
          margin: 0 auto 10px;
        }
        
        /* Card Styles */
        .dh-card {
          background: #fff;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
        }
        .dh-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .dh-card-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .dh-file-icon {
          width: 28px;
          height: 28px;
          background: #f2f3f7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dh-id {
          font-size: 15px;
          font-weight: 700;
          color: #111;
          letter-spacing: 0.2px;
        }
        .dh-status {
          font-size: 15px;
          font-weight: 700;
        }
        .dh-finish { color: #111; }
        .dh-failed { color: #e8392a; }
        .dh-pending { color: #f59e0b; }
        
        .dh-divider {
          height: 1px;
          background: #f0f1f4;
          margin: 14px 0;
          width: 100%;
        }

        /* Gray Info Box */
        .dh-info {
          background: #f2f3f7;
          border-radius: 6px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .dh-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .dh-label {
          color: #8c93a1;
          font-size: 14px;
        }
        .dh-value {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #333;
          font-size: 14px;
          font-weight: 400;
        }
        .dh-net-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }
        
        /* Amount Section (Bottom) */
        .dh-amount-section {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 6px;
          margin-top: 16px;
        }
        .dh-amount-label {
          color: #8c93a1;
          font-size: 14px;
        }
        .dh-usdt-badge {
          width: 18px;
          height: 18px;
          background: #26a17b;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          line-height: 1;
        }
        .dh-amount-val {
          font-size: 16px;
          font-weight: 700;
          color: #111;
        }
      `}</style>
    </>
  );
}