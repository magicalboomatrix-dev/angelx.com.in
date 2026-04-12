"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { useRouter, useParams } from "next/navigation";

function formatDateTime(dateStr) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function DepositDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [depositInfo, setDepositInfo] = useState({ TRC20: {}, BEP20: {} });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    const fetchAll = async () => {
      try {
        const [txRes, infoRes] = await Promise.all([
          fetch(`/api/deposit-history/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/deposit-info"),
        ]);
        if (!txRes.ok) { router.push("/deposit-history"); return; }
        const txData = await txRes.json();
        setTx(txData.transaction);
        if (infoRes.ok) {
          const info = await infoRes.json();
          setDepositInfo(info);
        }
      } catch {
        router.push("/deposit-history");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, router]);

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text)
      .then(() => setMessage({ type: "success", text: "Copied to clipboard ✅" }))
      .catch(() => setMessage({ type: "error", text: "Failed to copy ❌" }));
  };

  if (loading) return <div style={{ textAlign: "center", paddingTop: "80px", color: "#aaa" }}>Loading...</div>;
  if (!tx) return null;

  const network = tx.network || "TRC20";
  const networkKey = network === "BEP20" ? "BEP20" : "TRC20";
  const networkInfo = depositInfo[networkKey] || {};
  const qrUrl = networkInfo.qrUrl ? `/${networkInfo.qrUrl}` : "/images/trc20.png";
  const depositAddress = tx.address || networkInfo.address || "";
  const depositId = tx.referenceId || String(tx.id);
  const amount = tx.amount ?? 0;
  
  const remarkMap = { SUCCESS: "Successful", FAILED: "Failed", REJECTED: "Rejected", PENDING: "Pending" };
  const remark = remarkMap[tx.status] || tx.status || "Pending";

  // Shared Styles
  const rowStyle = {
    padding: "15px 0",
    borderBottom: "1px solid #f0f0f0",
  };
  const titleStyle = {
    color: "#8e8e8e",
    fontSize: "14px",
    marginBottom: "8px",
  };
  const valueStyle = {
    fontSize: "15px",
    color: "#333",
    fontWeight: "500",
    wordBreak: "break-all",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", fontFamily: "sans-serif" , margin: "0 auto 60px", maxWidth: "400px"}}>
      {/* Header */}
      <header style={{ 
        display: "flex", alignItems: "center", justifyContent: "space-between", 
        padding: "15px", backgroundColor: "#fff", position: "sticky", top: 0, zIndex: 10 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Link href="/deposit-history">
            <img src="/images/back-btn.png" style={{ height: "20px" }} alt="back" />
          </Link>
        </div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", margin: "0 auto"}}>Deposit USDT</h3>

        <div style={{ display: "flex", gap: "15px" }}>
          <img src="/images/gray-warn.png" style={{ height: "22px" }} alt="warn" />
           <div className="right exchange-support">
              <a href="https://vm.nebestbox.com/1jgm3swhyv8jv09qrr9q3o7lgp">
                <Image
                  src="/images/customer-care-icon1.png"
                  alt="support"
                  width={24}
                  height={24}
                  priority
                />
              </a>
            </div>
        </div>
      </header>

      <main style={{ padding: "15px" }}>
        {/* QR Section */}
        <section style={{ textAlign: "center", marginBottom: "25px" }}>
          <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "10px" }}>Scan the QR code and pay</p>
          <div style={{ padding: "10px", display: "inline-block" }}>
            <img src={qrUrl} style={{ height: "120px", width: "120px" }} alt="QR Code" />
          </div>
          <p style={{ fontSize: "12px", color: "#666", padding: "0 20px", lineHeight: "1.4", fontWeight: "500" }}>
            If have transaction fee, don't forget to add it. The transfer amount must match the deposit amount
          </p>
        </section>

        {/* Info Card */}
        <div style={{ 
          backgroundColor: "#fff", borderRadius: "12px", padding: "5px 20px", 
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)" 
        }}>
          {/* Amount */}
          <div style={rowStyle}>
            <p style={titleStyle}>Deposit amount</p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img src="/images/uic.png" style={{ height: "20px" }} alt="usdt" />
              <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>{amount}</h3>
            </div>
          </div>

          {/* Address */}
          <div style={rowStyle}>
            <p style={titleStyle}>Deposit address</p>
            <div style={valueStyle}>
              <span style={{ flex: 1 }}>{depositAddress}</span>
              <img 
                src="/images/copy.png" 
                style={{ height: "18px", marginLeft: "10px", cursor: "pointer" }} 
                onClick={() => handleCopy(depositAddress)} 
              />
            </div>
          </div>

          {/* Yellow Warning */}
          <div style={{ 
            backgroundColor: "#fffdf0", border: "1px solid #fff3cd", borderRadius: "8px", 
            padding: "10px", margin: "15px 0", fontSize: "12px", color: "#333", lineHeight: "1.5"
          }}>
            <img src="/images/warn.png" style={{ height: "14px", marginRight: "5px", verticalAlign: "middle" }} />
            Only support <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>{networkKey}-USDT</span>, 
            Any losses caused by your improper operation will be borne by yourself. 
            Please operate with caution and double-check the recharge address carefully
          </div>

          {/* Deposit ID */}
          <div style={rowStyle}>
            <p style={titleStyle}>Deposit ID</p>
            <div style={valueStyle}>
              <span>{depositId}</span>
              <img 
                src="/images/copy.png" 
                style={{ height: "18px", cursor: "pointer" }} 
                onClick={() => handleCopy(depositId)} 
              />
            </div>
          </div>

          {/* Network */}
          <div style={rowStyle}>
            <p style={titleStyle}>Network</p>
            <div style={{ ...valueStyle, justifyContent: "flex-start", gap: "8px" }}>
              <img 
                src={networkKey === "TRC20" ? "/images/tb-ic1.png" : "/images/tb-ic2.png"} 
                style={{ height: "20px" }} 
              />
              USDT-{network}
            </div>
          </div>

          {/* Create Time */}
          <div style={rowStyle}>
            <p style={titleStyle}>Create time</p>
            <div style={{ ...valueStyle, fontWeight: "400" }}>{formatDateTime(tx.createdAt)}</div>
          </div>

          {/* Remark */}
          <div style={{ ...rowStyle, borderBottom: "none" }}>
            <p style={titleStyle}>Remark</p>
            <div style={{ ...valueStyle, fontWeight: "400" }}>{remark}</div>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{ marginTop: "20px", paddingLeft: "5px" }}>
          <p style={{ color: "#ff4d4f", fontSize: "14px", display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ fontSize: "20px", lineHeight: 0 }}>•</span> {networkKey}-USDT only
          </p>
        </div>
      </main>

      {/* Copy Notification Toast */}
      {message && (
        <div style={{
          position: "fixed", bottom: "10%", left: "50%", transform: "translateX(-50%)",
          backgroundColor: "rgba(0,0,0,0.7)", color: "#fff", padding: "10px 20px",
          borderRadius: "20px", fontSize: "14px", zIndex: 100
        }}>
          {message.text}
        </div>
      )}
    </div>
  );
}