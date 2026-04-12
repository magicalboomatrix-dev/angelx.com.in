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
    if (typeof window === 'undefined') return;
    
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
    <div style={{maxWidth:"480px"}}> 
      <main>
        <div className="page-wrappers page-wrapper-ex home-wrappers mine-dashboard" style={{height: 'auto',paddingBottom: '50px'}}>
          <header className="header mine-header" style={{position: "relative"}}>
            <div className="left"></div>
            <div className="right">
              { /* <img src="images/customer-care.png" /> */ }
              <a href="https://vm.nebestbox.com/1jgm3swhyv8jv09qrr9q3o7lgp">
                <Image                
                src="/images/customer-care-icon1.png"
                alt="customer"
                width={24}
                height={24}
                priority
                /></a>

              <Link className='setting' href="/setting">
                <Image                
                src="/images/settings.webp"
                alt="setting"
                width={24}
                height={24}
                priority
                /></Link>
            </div>
          </header>



          <div className="page-overflows">        
          <div className="page-wrapper page-wrapper-ex">
            <section className="section-1 mine-hero">
              <div className="userpro mine-userpro">
                <div className="pic">
                  <img src="/images/user-pic.png" />
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

            <section className="section-2a">
              <div className="inside">
                <div className="top">
                  <div className="lefts">
                    <div className="lf">
                      <img src="/images/payx.jpg" />
                    </div>
                    <div className="rf">
                      <p className="ttl">
                        <b>0 PAYX</b>
                      </p>
                      <p className="item-mine">
                        <p style={{ fontSize: '10px' }}>1PAYX = 0.010163USDT</p>
                        <img src="/images/ques.png" className="inq" />
                      </p>
                    </div>
                  </div>
                  <Link href="/withdraw">
                    <div className="rights">
                      <button className="btn">Withdraw</button>
                    </div>
                  </Link>
                  
                </div>
                 <div className="btm">
                  <button className="btn">To AngelX pro</button>
                </div>
               
              </div>
            </section>

            <section className="section-3 mine-reward-card">
              <div className="inside">
                <div className="lefts">
                  <p className="ttl">Exchange</p>
                  <p>
                    <b>$0</b>
                  </p>
                </div>
                <div className="mid">
                  <p className="ttl">
                    Reward <img src="/images/payx.jpg" />
                  </p>
                  <p>
                    <b>0</b>
                  </p>
                </div>
                <div className="rights">
                  <button className="btn">Details</button>
                   <p>{today}</p>
                </div>
              </div>
            </section>

            <section className="section-2 reffer mine-links">
              <div className="rw">
                <div className="bx">
                  <Link href="/referals">
                    <div className="image">
                      <h3>
                        <img src="/images/ref-icon1.png" /> Referrals
                      </h3>
                    </div>
                    <div className="arw">
                      <img src="/images/right-arw.png" />
                    </div>
                  </Link>
                </div>
                <div className="bx">
                  <Link href="/history">
                    <div className="image">
                      <h3>
                        <img src="/images/ref-icon2.png" /> Exchange history
                      </h3>
                    </div>
                    <div className="arw">
                      <img src="/images/right-arw.png" />
                    </div>
                  </Link>
                </div>
                <div className="bx">
                  <Link href="/statements">
                    <div className="image">
                      <h3>
                        <img src="/images/ref-icon3.png" /> Statement
                      </h3>
                    </div>
                    <div className="arw">
                      <img src="/images/right-arw.png" />
                    </div>
                  </Link>
                </div>
                <div className="bx">
                  <Link href="/bank">
                    <div className="image">
                      <h3>
                        <img src="/images/ref-icon4.png" /> Bank account
                      </h3>
                    </div>
                    <div className="arw">
                      <img src="/images/right-arw.png" />
                    </div>
                  </Link>
                </div>
                <div className="bx">
                  <Link href="/invite">
                    <div className="image">
                      <h3>
                        <img src="/images/ref-icon5.png" /> Invite friends
                      </h3>
                    </div>
                    <div className="arw">
                      <img src="/images/right-arw.png" />
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
          background-image: linear-gradient(180deg, #fff6d8 0%, #fffaf0 16%, #fefefe 38%, #ffffff 100%), url('/images/home-bg1.png');
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
        }

        .mine-dashboard .mine-stats {
          padding: 0 2px 16px;
          gap: 0;
        }

        .mine-dashboard .mine-stats .bx {
          padding: 0 4px;
          border-right-color: rgba(40, 40, 40, 0.12);
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

        .mine-dashboard .mine-payx-card {
          margin: 8px 0 12px;
          padding: 10px 12px 12px;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 8px 18px rgba(19, 34, 90, 0.12);
          background-size: cover;
          background-position: center;
        }

        .mine-dashboard .mine-payx-card .inside .top {
          gap: 12px;
        }

        .mine-dashboard .mine-payx-card .inside .top .lefts .lf img {
          max-width: 37px;
          border-radius: 50%;
        }

        .mine-dashboard .mine-payx-card .inside .top .lefts .rf {
          padding-left: 8px;
        }

        .mine-dashboard .mine-payx-card .inside .top .lefts p.ttl {
          margin-bottom: 2px;
          font-size: 13px;
          color: #ffd14f;
        }

        .mine-dashboard .mine-payx-card .inside .top .lefts .rf p {
          font-size: 12px;
          line-height: 1.2;
        }

        .mine-dashboard .mine-payx-card .inside .top .lefts .rf p span {
          opacity: 0.92;
        }

        .mine-dashboard .mine-payx-card .inside .top .rights button.btn {
          min-width: 111px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 500;
          box-shadow: inset 0 0 0 1px rgba(173, 87, 13, 0.08);
        }

        .mine-dashboard .mine-payx-card .inside .btm button {
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
        }

        .mine-dashboard .mine-reward-card .inside {
          margin-top: 0;
          padding: 16px 15px 17px;
          border-radius: 14px;
          align-items: center;
          box-shadow: 0 7px 16px rgba(229, 196, 104, 0.16);
          background-size: 100% 100%;
        }

        .mine-dashboard .mine-reward-card .inside > div {
          min-height: 60px;
        }

        .mine-dashboard .mine-reward-card .inside .mid {
          margin-left: 10px;
          border-right-color: rgba(27, 27, 27, 0.5);
        }

        .mine-dashboard .mine-reward-card .inside .rights {
          max-width: 108px;
          padding-left: 12px;
        }

        .mine-dashboard .mine-reward-card .inside p.ttl {
          padding-bottom: 6px;
          font-size: 14px;
          font-weight: 500;
        }

        .mine-dashboard .mine-reward-card .inside p b {
          font-size: 17px;
          font-weight: 700;
          color: #141414;
        }

        .mine-dashboard .mine-reward-card .inside button.btn {
          min-width: 98px;
          margin-bottom: 9px;
          padding: 8px 0;
          font-size: 13px;
          font-weight: 600;
        }

        .mine-dashboard .mine-reward-card .inside .rights p {
          font-size: 12px;
          color: #2f2f2f;
          font-weight: 500;
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
          min-height: 28px;
        }

        .mine-dashboard .mine-links .bx .image h3 {
          font-size: 15px;
          font-weight: 600;
          color: #212121;
        }

        .mine-dashboard .mine-links .bx .image h3 > img {
          width: 26px;
          height: 26px;
          object-fit: contain;
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
}
