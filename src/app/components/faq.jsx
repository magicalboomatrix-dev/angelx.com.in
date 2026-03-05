import React, { useState } from "react";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="containers">
        <div className="wrapper">
          <div className="text-center">
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="faq-list">
            {/* FAQ 1 */}
            <div className="container01">
              <div
                className={`question ${activeIndex === 0 ? "active" : ""}`}
                onClick={() => toggleFAQ(0)}
              >
                <span className="sr">01.</span> What is AngelX and how does it work for USDT to INR exchange?
              </div>
              <div
                className="answercont"
                style={{
                  maxHeight: activeIndex === 0 ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <div className="answer">
                  AngelX is a trusted Singapore-based crypto exchange app founded in 2021, specializing in instant USDT to INR conversions without KYC. Download the AngelX Apk, sign in with your mobile number, deposit USDT via TRC20/BEP20/ERC20, and get INR payouts to any Indian bank in 30 minutes.
                </div>
              </div>
            </div>

            {/* FAQ 2 */}
            <div className="container01">
              <div
                className={`question ${activeIndex === 1 ? "active" : ""}`}
                onClick={() => toggleFAQ(1)}
              >
                <span className="sr">02.</span> Can I sell USDT for INR on AngelX without KYC?
              </div>
              <div
                className="answercont"
                style={{
                  maxHeight: activeIndex === 1 ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <div className="answer">
                  Yes, AngelX offers zero KYC for USDT to INR exchanges—no PAN, Aadhaar, or ID needed. Enjoy full anonymity while selling USDT at premium rates higher than market USD/INR, with fast deposits and direct bank transfers.
                </div>
              </div>
            </div>

            {/* FAQ 3 */}
            <div className="container01">
              <div
                className={`question ${activeIndex === 2 ? "active" : ""}`}
                onClick={() => toggleFAQ(2)}
              >
                <span className="sr">03.</span> What are the best USDT rates on AngelX?
              </div>
              <div
                className="answercont"
                style={{
                  maxHeight: activeIndex === 2 ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <div className="answer">
AngelX provides premium USDT rates above market levels for maximum INR payouts. Check live, transparent USDT pricing in the app, sourced from Binance and WazirX, with real-time data for TRC20, BEP20, and ERC20 networks—no hidden fees.
                </div>
              </div>
            </div>

            {/* FAQ 4 */}
            <div className="container01">
              <div
                className={`question ${activeIndex === 3 ? "active" : ""}`}
                onClick={() => toggleFAQ(3)}
              >
                <span className="sr">04.</span>  How long does it take to deposit USDT and withdraw INR on AngelX?
              </div>
              <div
                className="answercont"
                style={{
                  maxHeight: activeIndex === 3 ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <div className="answer">
					USDT wallet (TRC20, BEP20, ERC20) deposits are confirmed in 1-2 minutes. INR withdrawals to your Indian bank account after your sell request land in around 30 minutes through IMPS or RTGS, much faster than traditional platforms.
                </div>
              </div>
            </div>

            {/* FAQ 5 */}
            <div className="container01">
              <div
                className={`question ${activeIndex === 4 ? "active" : ""}`}
                onClick={() => toggleFAQ(4)}
              >
                <span className="sr">05.</span> Is AngelX Apk safe and free to download?

              </div>
              <div
                className="answercont"
                style={{
                  maxHeight: activeIndex === 4 ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <div className="answer">
                  Certainly, the AngelX Apk is 100% free and safe with auto-update. Since 2021, thousands of crypto users have relied upon it for some anonymous USDT to INR swaps and real-time portfolio tracking around the clock- without charges or risking privacy.
                </div>
              </div>
            </div>

            <div className="container01">
              <div
                className={`question ${activeIndex === 5 ? "active" : ""}`}
                onClick={() => toggleFAQ(5)}
              >
                <span className="sr">06.</span> Which bank accounts can I link for AngelX INR payouts?
              </div>
              <div
                className="answercont"
                style={{
                  maxHeight: activeIndex === 5 ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <div className="answer">
                   Link any Indian bank account (yours or even rental) on AngelX—no verification required. Get swift, risk-free INR deposits via direct transfers, supporting all major banks for hassle-free USDT selling.

                </div>
              </div>
            </div>

            <div className="container01">
              <div
                className={`question ${activeIndex === 6 ? "active" : ""}`}
                onClick={() => toggleFAQ(6)}
              >
                <span className="sr">07.</span> Does AngelX support all USDT networks for deposits?

              </div>
              <div
                className="answercont"
                style={{
                  maxHeight: activeIndex === 6 ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <div className="answer">
                  Yes, AngelX handles TRC20, BEP20, ERC20, and more for seamless USDT deposits from any wallet. Approvals are instant (1-2 minutes), making it the best crypto exchange for Indians converting stablecoins to INR.
                </div>
              </div>
            </div>

            <div className="container01">
              <div
                className={`question ${activeIndex === 7 ? "active" : ""}`}
                onClick={() => toggleFAQ(7)}
              >
                <span className="sr">08.</span> How can I get 24/7 support for AngelX USDT to INR issues?

              </div>
              <div
                className="answercont"
                style={{
                  maxHeight: activeIndex === 7 ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <div className="answer">                  
AngelX provides 24/7 live chat and phone support from actual agents. View transactions within the app, download statements in seconds, or call us 24/7 for assistance with rates, deposits and pay outs.

                </div>
              </div>
            </div>
			
			


            {/* Add more FAQs below as needed */}
          </div>
        </div>
      </div>
    </section>
  );
}

