"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState("");

  // Helper to mask mobile number
  function maskMobile(mobile) {
    const digits = String(mobile ?? "").replace(/\D/g, "");
    if (digits.length < 7) return mobile;
    return `${digits.slice(0, 3)}***${digits.slice(-4)}`;
  }

  function formatWalletValue(value) {
    const amount = Number(value || 0);
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  useEffect(() => {
    const now = new Date();
    const options = { day: "numeric", month: "long" };
    setToday(now.toLocaleDateString("en-GB", options));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="page-wrappers">
        <div className="loader">
          <Image
            src="/images/loading.webp"
            alt="loader"
            width={30}
            height={30}
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <main>
        <div className="page-wrappers page-wrapper-ex home-wrappers mine-dashboard" style={{ height: "auto", paddingBottom: "50px" }}>
          <header className="header mine-header" style={{ position: "relative" }}>
            <div className="left"></div>
            <div className="right">
              <a href="https://vm.nebestbox.com/1jgm3swhyv8jv09qrr9q3o7lgp">
                <Image src="/images/customer-care-icon1.png" alt="customer" width={24} height={24} priority />
              </a>
              <Link className="setting" href="/setting">
                <Image src="/images/settings.webp" alt="setting" width={24} height={24} priority />
              </Link>
            </div>
          </header>

          <div className="page-overflows">
            <div className="page-wrapper page-wrapper-ex">
              <section className="section-1 mine-hero">
                <div className="userpro mine-userpro">
                  <div className="pic">
                    <img src="/images/user-pic.png" alt="user" />
                  </div>
                  <h3>+91 {user?.mobile ? maskMobile(user.mobile) : "*** ***"}</h3>
                </div>

                <div className="tab-inl mine-stats">
                  <div className="bx">
                    <p>Total Amount($)</p>
                    <h3>{formatWalletValue(user?.wallet?.total)}</h3>
                  </div>
                  <div className="bx">
                    <p>Available($)</p>
                    <h3>{formatWalletValue(user?.wallet?.available)}</h3>
                  </div>
                  <div className="bx">
                    <p>Progressing($)</p>
                    <h3>{formatWalletValue(user?.wallet?.progressing)}</h3>
                  </div>
                </div>
              </section>

              {/* UPDATED UI: PAYX CARD */}
              <section className="payx-card-custom">
                <div className="payx-content">
                  <div className="payx-row">
                    <div className="payx-left">
                      <div className="payx-icon-wrapper">
                        <img src="/images/payx.jpg" alt="payx" />
                      </div>
                      <div className="payx-info">
                        <h2 className="payx-balance">0 PAYX</h2>
                        <div className="payx-rate">
                          <span>1PAYX = 0.010131USDT</span>
                          <img src="/images/ques.png" className="info-icon" />
                        </div>
                      </div>
                    </div>
                    <Link href="/withdraw">
                      <button className="withdraw-btn">Withdraw</button>
                    </Link>
                  </div>
                  <button className="angelx-btn">To AngelX pro</button>
                </div>
              </section>

              {/* UPDATED UI: REWARD CARD */}
              <section className="reward-card-custom">
                <div className="reward-grid">
                  <div className="reward-item">
                    <span className="reward-label">Exchange</span>
                    <span className="reward-value">$0</span>
                  </div>
                  <div className="reward-item">
                    <span className="reward-label">
                      Reward <img src="/images/payx.jpg" className="small-payx" alt="payx" />
                    </span>
                    <span className="reward-value">0</span>
                  </div>
                  <div className="reward-divider"></div>
                  <div className="reward-action">
                    <button className="details-btn">Details</button>
                    <span className="reward-date">{today}</span>
                  </div>
                </div>
              </section>

              <section className="section-2 reffer mine-links">
                <div className="rw">
                  <div className="bx">
                    <Link href="/referals">
                      <div className="image">
                        <h3>
                          <img src="/images/ref-icon1.png" alt="icon" /> Referrals
                        </h3>
                      </div>
                      <div className="arw">
                        <img src="/images/right-arw.png" alt="arrow" />
                      </div>
                    </Link>
                  </div>
                  <div className="bx">
                    <Link href="/history">
                      <div className="image">
                        <h3>
                          <img src="/images/ref-icon2.png" alt="icon" /> Exchange history
                        </h3>
                      </div>
                      <div className="arw">
                        <img src="/images/right-arw.png" alt="arrow" />
                      </div>
                    </Link>
                  </div>
                  <div className="bx">
                    <Link href="/statements">
                      <div className="image">
                        <h3>
                          <img src="/images/ref-icon3.png" alt="icon" /> Statement
                        </h3>
                      </div>
                      <div className="arw">
                        <img src="/images/right-arw.png" alt="arrow" />
                      </div>
                    </Link>
                  </div>
                  <div className="bx">
                    <Link href="/bank">
                      <div className="image">
                        <h3>
                          <img src="/images/ref-icon4.png" alt="icon" /> Bank account
                        </h3>
                      </div>
                      <div className="arw">
                        <img src="/images/right-arw.png" alt="arrow" />
                      </div>
                    </Link>
                  </div>
                  <div className="bx">
                    <Link href="/invite">
                      <div className="image">
                        <h3>
                          <img src="/images/ref-icon5.png" alt="icon" /> Invite friends
                        </h3>
                      </div>
                      <div className="arw">
                        <img src="/images/right-arw.png" alt="arrow" />
                      </div>
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .mine-dashboard {
          min-height: 100vh;
          padding-bottom: 78px !important;
          background-image: linear-gradient(180deg, #fff6d8 0%, #fffaf0 16%, #fefefe 38%, #ffffff 100%), url("/images/home-bg1.png");
          background-repeat: no-repeat;
          background-position: top center;
          background-size: 100% auto;
        }

        .mine-dashboard .page-overflows {
          padding: 0 14px 6px;
        }

        .mine-dashboard .page-wrapper.page-wrapper-ex {
          margin-top: 0;
          padding-top: 2px;
        }

        .mine-dashboard .mine-header {
          padding: 15px 16px 6px;
        }

        .mine-dashboard .mine-header .right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mine-dashboard .mine-hero {
          padding-top: 6px;
        }

        .mine-dashboard .mine-userpro .pic {
          width: 92px;
          height: 92px;
          margin: 0 auto;
          border-radius: 50%;
          overflow: hidden;
          background: radial-gradient(circle at 50% 35%, #d8bc72 0%, #c7a14f 100%);
          box-shadow: 0 10px 24px rgba(204, 176, 105, 0.18);
        }

        .mine-dashboard .mine-userpro .pic img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mine-dashboard .mine-userpro h3 {
          padding: 14px 0 18px;
          font-size: 19px;
          line-height: 1.1;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #171717;
          text-align: center;
        }

        .mine-dashboard .mine-stats {
          display: flex;
          justify-content: space-around;
          padding: 0 2px 16px;
          gap: 0;
        }

        .mine-dashboard .mine-stats .bx {
          padding: 0 4px;
          text-align: center;
        }

        .mine-dashboard .mine-stats .bx p {
          margin: 0 0 7px;
          font-size: 12px;
          line-height: 1.2;
          color: #8c8c8c;
          font-weight: 500;
        }

        .mine-dashboard .mine-stats .bx h3 {
          font-size: 16px;
          line-height: 1;
          font-weight: 700;
          color: #252525;
        }

        /* NEW PAYX CARD STYLES */
        .payx-card-custom {
          background: linear-gradient(180deg, #0b1a4a 0%, #050a1f 100%);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 12px;
          color: white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .payx-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .payx-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .payx-icon-wrapper img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
        }

        .payx-balance {
          font-size: 16px;
          font-weight: 800;
          margin: 0;
           color: #fcda8f;
        }

        .payx-rate {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          opacity: 0.9;
        }

        .info-icon {
          width: 14px;
          height: 14px;
          filter: brightness(0) invert(1);
        }

        .withdraw-btn {
          background: #f3d4b1;
          color: #8a5a2b;
          border: none;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }

        .angelx-btn {
          width: 100%;
          background: #41517d;
          border: none;
          color: white;
          padding: 10px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
        }

        /* NEW REWARD CARD STYLES */
        .reward-card-custom {
          background-color: #fff9d6;
          background-image: radial-gradient(#f0e0a0 1px, transparent 1px);
          background-size: 15px 15px;
          border-radius: 12px;
          padding: 20px 16px;
          margin-bottom: 20px;
        }

        .reward-grid {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .reward-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .reward-label {
          font-size: 14px;
          color: #444;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .small-payx {
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }

        .reward-value {
          font-size: 22px;
          font-weight: 700;
          color: #000;
        }

        .reward-divider {
          width: 1px;
          height: 40px;
          background: #000;
          opacity: 0.3;
          margin: 0 10px;
        }

        .reward-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .details-btn {
          background: #1a1a1a;
          color: white;
          border: none;
          padding: 6px 24px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .reward-date {
          font-size: 12px;
          color: #666;
        }

        .mine-dashboard .mine-links {
          padding-top: 14px;
        }

        .mine-dashboard .mine-links .bx {
          margin: 0;
          padding: 10px 2px 10px 0;
          border-bottom: 1px solid rgba(10, 10, 10, 0.05);
          background: transparent;
        }

        .mine-dashboard .mine-links .bx:last-child {
          border-bottom: 0;
        }

        .mine-dashboard .mine-links .bx a {
          display: flex;
          justify-content: space-between;
          align-items: center;
          min-height: 28px;
          text-decoration: none;
        }

        .mine-dashboard .mine-links .bx .image h3 {
          font-size: 15px;
          font-weight: 600;
          color: #212121;
          display: flex;
          align-items: center;
        }

        .mine-dashboard .mine-links .bx .image h3 > img {
          width: 26px;
          height: 26px;
          object-fit: contain;
          margin-right: 10px;
        }

        .mine-dashboard .mine-links .bx .arw img {
          width: 16px;
          height: 16px;
        }
      `}</style>
    </div>
  );
}