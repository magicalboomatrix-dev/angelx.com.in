'use client'
import React, { useCallback, useEffect, useState } from 'react';
import Image from "next/image";
import Link from 'next/link';

import FAQ from "./components/faq";
import Footer from './components/footer';
import Readmore from "./components/Readmore";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [rate, setRate] = useState(0);
  
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const fetchRate = useCallback(async () => {
    try {
      const res = await fetch('/api/limits');
      if (!res.ok) {
        setRate(0);
        return;
      }

      const data = await res.json();
      setRate(data.rate || 0);
    } catch {
      setRate(0);
    }
  }, []);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  const [timeLeft, setTimeLeft] = useState(52);
  
  useEffect(() => {
    if (!mounted) return;
    
    if (timeLeft <= 0) {
      // window.location.reload(); // Commented out for performance optimization. Consider re-fetching data instead of full page reload.
      fetchRate();
      setTimeLeft(52); // Reset timer to continue countdown without reloading page
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); 
  }, [timeLeft, mounted, fetchRate]);

  const [showAppLink, setShowAppLink] = useState(true);
 
  return (   
    <div>
      <div className="page-wrappers"  style={{height: '100%'}}>
         {loading && <div className="loader">
          <Image 
            src="/images/loading.webp"
            alt="loader"
            width={30}
            height={30}
            priority
          />
          </div>}
        {!loading && (
          <div>

          </div>
        )}

        {showAppLink && (
          <div className="applinkMainDiv">
            <div className="applinkdownload">
              <div className="appimgtext">
                <img src="/images/applinkimg.jpeg" alt="AngelX" />
                <div className="textlink">
                  <h4>AngelX</h4>
                  <p>India’s #1 Trusted USDT Exchange Platform</p>
                </div>
              </div>
  
              <Link
                href="/AngelX.apk"
                className="downloadbutton"
                download
              >
                Download
              </Link>
            </div>
  
            <button
              className="closeAppLink"
              onClick={() => setShowAppLink(false)}
            >
              X
            </button>
          </div>
        )}
        
        <header className="header" style={{position: 'relative'}}>
            <div className="left">

                <div className="header-left">
                  <img alt="AngelX Logo" className="logo" src="/images/logo-icon.png" />
                  <h3 className="title-left">AngelX</h3>
                </div>
            </div>
            <div className="right">
            <a href="https://vm.nebestbox.com/1jgm3swhyv8jv09qrr9q3o7lgp">
                <Image                
                src="/images/customer-care-icon.png"
                alt="customer"
                width={24}
                height={24}
                priority
                /></a>
            </div>
        </header>

        <div className="page-wrapper" style={{paddingTop: '2px', marginTop: '0px',height: '100%',marginBottom:"65px"}}>
            <section className="section-1 hm-section-1">
            <div className="image">
                <Image                
                src="/images/welcome-banner.png"
                alt="welcome to angelx"
                width={339}
                height={109}
                priority
                />
                </div>
            </section>

            <section className="section-2 hm-section-2">
                <div className="rw">
                <div className="bx">
                <div className="left">
                <div className="image">
                     <Image                
                src="/images/get-started.png"
                alt="angelx"
                width={96}
                height={96}
                priority
                />
                </div>
                </div>
                <div className="right">
                <div className="info">
                    <h3>Get started in seconds</h3>
                    <p>Whether you are a beginner or an expert, you can easily get started without any professional knowledge.</p>
                </div>
                </div>
                </div>
                
                <div className="bx">
                <div className="left">
                <div className="image">
                <Image                
                src="/images/boost.png"
                alt="angelx"
                width={96}
                height={96}
                priority
                />
                </div>
                </div>
                <div className="right">
                <div className="info">
                    <h3>Boost your yields</h3>
                    <p>Every transaction has potential for huge profits, allowing every user to thrive simultaneously with the platform.</p>
                </div>
                </div>
                </div>
                
                <div className="bx">
                <div className="left">
                <div className="image">
                    <Image                
                    src="/images/access.png"
                    alt="angelx"
                    width={96}
                    height={96}
                    priority
                    />
                </div>
                </div>
                <div className="right">
                <div className="info">
                    <h3>Acess expert knowledge</h3>
                    <p>Ensure that every user can earn profits on the platform regardless of how much money they have.</p>
                </div>
                </div>
                </div>
                </div>
            </section>

            <>
  <section className="section-3">
<div className="screenshot-wrapper">
  <div className="image">
    <Image 
      alt="Logo" 
      className="screenshot-img" 
      src="/images/hm-mob-img.jpg" 
      width={360} // Estimated width based on common mobile screenshot dimensions. Verify actual image dimensions.
      height={640} // Estimated height based on common mobile screenshot dimensions. Verify actual image dimensions.
      priority
    />                  
  </div>
  <div className="overlay-box">
    <div className="overlay-header">
      <h2>Platform price</h2>
    </div>
    <div className="price-calc">
      <div className="priceref">
        <p>
          Automatic refresh after{" "}
          <span className="ref">
            {timeLeft}s
          </span>
        </p>
      </div>
      <div className="reff-price">
        <div className="base-price">
          <h4>
            {rate} <span>Base</span>
          </h4>
        </div>
        <p className="onepriceex">1 USDT = ₹{rate}</p>
      </div>
    </div>
  </div>
</div>
    
    <p className="title">
      <b>AngelX official screenshot</b>
    </p>
  </section>
  <section className="section-4">
    <h3 className="title">Market list</h3>
    <table>
      <tbody>
        <tr>
          <th>
            <small>Digital Coin</small>
          </th>
          <th>
            <small>Volume(24h)</small>
          </th>
          <th>
            <small>Price</small>
          </th>
        </tr>
        <tr>
          <td>
            <div className="dflex">
              <div className="icon">
                <Image                
                src="/images/matic.png"
                alt="Matic"
                width={35}
                height={35}
                priority
                />                  
              </div>
              <div className="info">
                <h3>Matic</h3>
                <p>+1.15%</p>
              </div>
            </div>
          </td>
          <td>
            <h4>$25,418,370.3</h4>
          </td>
          <td>
            <h4>$0.5507</h4>
          </td>
        </tr>
        <tr>
          <td>
            <div className="dflex">
              <div className="icon">
                <Image                
                src="/images/shib.png"
                alt="Shib"
                width={35}
                height={35}
                priority
                /> 
                
              </div>
              <div className="info">
                <h3>Shib</h3>
                <p>+0.1%</p>
              </div>
            </div>
          </td>
          <td>
            <h4>$14,522,434.3</h4>
          </td>
          <td>
            <h4>$0.0005507</h4>
          </td>
        </tr>
        <tr>
          <td>
            <div className="dflex">
              <div className="icon">
                <Image                
                src="/images/fil.png"
                alt="Fil"
                width={35}
                height={35}
                priority
                /> 
                
              </div>
              <div className="info">
                <h3>Fil</h3>
                <p>+1.36%</p>
              </div>
            </div>
          </td>
          <td>
            <h4>$67,324,567.3</h4>
          </td>
          <td>
            <h4>$0.0564500</h4>
          </td>
        </tr>
        <tr>
          <td>
            <div className="dflex">
              <div className="icon">
                <Image                
                src="/images/matic.png"
                alt="matic"
                width={35}
                height={35}
                priority
                /> 
                
              </div>
              <div className="info">
                <h3>Eos</h3>
                <p>+2.14%</p>
              </div>
            </div>
          </td>
          <td>
            <h4>$45,32,78.0</h4>
          </td>
          <td>
            <h4>$0.0445532</h4>
          </td>
        </tr>
        <tr>
          <td>
            <div className="dflex">
              <div className="icon">
                <Image                
                src="/images/eos.png"
                alt="eos"
                width={35}
                height={35}
                priority
                /> 
                
              </div>
              <div className="info">
                <h3>EOS</h3>
                <p>+0.05%</p>
              </div>
            </div>
          </td>
          <td>
            <h4>$43,656,343.0</h4>
          </td>
          <td>
            <h4>$1.0005786</h4>
          </td>
        </tr>
        <tr>
          <td>
            <div className="dflex">
              <div className="icon">
                <Image                
                src="/images/dot.png"
                alt="dot"
                width={35}
                height={35}
                priority
                /> 
                
              </div>
              <div className="info">
                <h3>DOT</h3>
                <p className="red">-0.34%</p>
              </div>
            </div>
          </td>
          <td>
            <h4>$34,876,23.0</h4>
          </td>
          <td>
            <h4>$345.67</h4>
          </td>
        </tr>
        <tr>
          <td>
            <div className="dflex">
              <div className="icon">
                <Image                
                src="/images/usdt.png"
                alt="usdt"
                width={35}
                height={35}
                priority
                /> 
                
              </div>
              <div className="info">
                <h3>USDT</h3>
                <p>+0.1%</p>
              </div>
            </div>
          </td>
          <td>
            <h4>$34,873,234.03</h4>
          </td>
          <td>
            <h4>$1.455654</h4>
          </td>
        </tr>
        <tr>
          <td>
            <div className="dflex">
              <div className="icon">
                <Image                
                src="/images/doge.png"
                alt="doge"
                width={35}
                height={35}
                priority
                /> 
                
              </div>
              <div className="info">
                <h3>Fil</h3>
                <p>+1.30%</p>
              </div>
            </div>
          </td>
          <td>
            <h4>$89,232,676.2</h4>
          </td>
          <td>
            <h4>$3460.67</h4>
          </td>
        </tr>
        <tr>
          <td>
            <div className="dflex">
              <div className="icon">
                <Image                
                src="/images/btc.png"
                alt="btc"
                width={35}
                height={35}
                priority
                /> 
                
              </div>
              <div className="info">
                <h3>BTC</h3>
                <p className="red">-0.14%</p>
              </div>
            </div>
          </td>
          <td>
            <h4>$45,32,78.0</h4>
          </td>
          <td>
            <h4>$0.0445532</h4>
          </td>
        </tr>
        <tr>
          <td>
            <div className="dflex">
              <div className="icon">
                <Image                
                src="/images/sol.png"
                alt="sol"
                width={35}
                height={35}
                priority
                /> 
                
              </div>
              <div className="info">
                <h3>SOL</h3>
                <p>+11.0%</p>
              </div>
            </div>
          </td>
          <td>
            <h4>$43,546,232.0</h4>
          </td>
          <td>
            <h4>$0.0004633</h4>
          </td>
        </tr>
        <tr>
          <td>
            <div className="dflex">
              <div className="icon">
                <Image                
                src="/images/ton.png"
                alt="ton"
                width={35}
                height={35}
                priority
                /> 
                
              </div>
              <div className="info">
                <h3>TON</h3>
                <p>+12.4%</p>
              </div>
            </div>
          </td>
          <td>
            <h4>$43,546,232.0</h4>
          </td>
          <td>
            <h4>$0.0004633</h4>
          </td>
        </tr>
        <tr>
          <td>
            <div className="dflex">
              <div className="icon">
                <Image                
                src="/images/avax.png"
                alt="avax"
                width={35}
                height={35}
                priority
                /> 
                
              </div>
              <div className="info">
                <h3>Avax</h3>
                <p className="red">-0.4%</p>
              </div>
            </div>
          </td>
          <td>
            <h4>$43,546,232.0</h4>
          </td>
          <td>
            <h4>$0.0004633</h4>
          </td>
        </tr>
        <tr>
          <td>
            <div className="dflex">
              <div className="icon">
                <Image                
                src="/images/bnb.png"
                alt="bnb"
                width={35}
                height={35}
                priority
                /> 
                
              </div>
              <div className="info">
                <h3>BNB</h3>
                <p>+11.0%</p>
              </div>
            </div>
          </td>
          <td>
            <h4>$43,546,232.0</h4>
          </td>
          <td>
            <h4>$0.0004633</h4>
          </td>
        </tr>
        <tr>
          <td>
            <div className="dflex">
              <div className="icon">
                <Image                
                src="/images/xrp.png"
                alt="xrp"
                width={35}
                height={35}
                priority
                /> 
                
              </div>
              <div className="info">
                <h3>XRP</h3>
                <p>+11.0%</p>
              </div>
            </div>
          </td>
          <td>
            <h4>$43,546,232.0</h4>
          </td>
          <td>
            <h4>$0.0004633</h4>
          </td>
        </tr>
        <tr>
          <td>
            <div className="dflex">
              <div className="icon">
                <Image                
                src="/images/eth.png"
                alt="eth"
                width={35}
                height={35}
                priority
                /> 
                
              </div>
              <div className="info">
                <h3>ETH</h3>
                <p className="red">-0.10%</p>
              </div>
            </div>
          </td>
          <td>
            <h4>$04,454,234.3</h4>
          </td>
          <td>
            <h4>$0.234556</h4>
          </td>
        </tr>
        <tr>
          <td>
            <div className="dflex">
              <div className="icon">
                <Image                
                src="/images/link.png"
                alt="link"
                width={35}
                height={35}
                priority
                /> 
                
              </div>
              <div className="info">
                <h3>LINK</h3>
                <p>+3.10%</p>
              </div>
            </div>
          </td>
          <td>
            <h4>$35,546,232.0</h4>
          </td>
          <td>
            <h4>$0.00347548</h4>
          </td>
        </tr>
        <tr>
          <td>
            <div className="dflex">
              <div className="icon">
                <Image                
                src="/images/trx.png"
                alt="trx"
                width={35}
                height={35}
                priority
                /> 
                
              </div>
              <div className="info">
                <h3>TRX</h3>
                <p>+6.00%</p>
              </div>
            </div>
          </td>
          <td>
            <h4>$43,344,544.0</h4>
          </td>
          <td>
            <h4>$0.0034768</h4>
          </td>
        </tr>
        <tr>
          <td>
            <div className="dflex">
              <div className="icon">
                <Image                
                src="/images/ada.png"
                alt="ada"
                width={35}
                height={35}
                priority
                /> 
                
              </div>
              <div className="info">
                <h3>ADA</h3>
                <p>+2.30%</p>
              </div>
            </div>
          </td>
          <td>
            <h4>$76,243,657.0</h4>
          </td>
          <td>
            <h4>$0.45435</h4>
          </td>
        </tr>
        <tr>
          <td>
            <div className="dflex">
              <div className="icon">
                <Image                
                src="/images/ftm.png"
                alt="ftm"
                width={35}
                height={35}
                priority
                />                 
              </div>
              <div className="info">
                <h3>FTM</h3>
                <p className="red">-0.10%</p>
              </div>
            </div>
          </td>
          <td>
            <h4>$23,455,345.0</h4>
          </td>
          <td>
            <h4>$0.0000445</h4>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

   <section className="game-detail">
        <div className="containers">
          <div className="rowr">
            <div className="col-left">
              <div className="text-left2">
                <h1>
                  Welcome to AngelX → Your Ultimate USDT-to-INR Exchange App!

                </h1>
              </div>
            </div>
            <div className="col-right">
              <div className="content">
                
<p>Fed up with complex crypto exchange platforms, numerous KYC steps and low rates? We are AngelX helping you with USDT-to-INR conversion. AngelX, a trustworthy crypto exchange in India founded in 2021 allows you to sell USDT for INR easily via — no hassle, on-the-go payouts, direct cash. Our platfrom delivers top USDT rates that beat the market.</p>

<p>Download the <Link href="https://www.angelx.com.in/AngelX.apk"><strong>AngelX Apk</strong></Link> today and experience the easiest crypto exchange for Indians. Trusted by thousands since 2021, AngelX is your go-to for reliable, no-KYC <strong>AngelX USDT selling</strong> services.</p>

                {/* ... the rest remains unchanged ... */}

                <Readmore>
                  <h2>What is AngelX?</h2>

                  <p>AngelX is a specialized mobile application (often referred to as AngelX) designed for selling USDT (Tether) and converting it to Indian Rupees (INR) via Bank. It emphasizes swift, {" "}instant payouts and 24/7 support for selling USDT. It acts as a digital asset marketplace focused on quick USDT to INR conversions.</p>

                  <h2>Key Features That Make AngelX Unbeatable</h2>

<p><strong>Download & Login:</strong> Get the AngelX Apk from our site. Sign In with only your mobile number — no password required.</p>

<p><strong>Zero KYC Needed:</strong> Instant crypto exchange on AngelX—no PAN, Aadhaar or any ID verification. Best suited for individuals who seek anonymity in USDT to INR transactions.</p>

<p><strong>Premium USDT Rates:</strong> We buy USDT at rates more than the market USDT which means boost in payout of your INR.</p>

<p><strong>Fast USDT Deposits & Approvals:</strong> Deposit from any wallet through ERC-20, TRC-20, and others; approvals take only 1-2 minutes.</p>

<p><strong>Add Bank Account:</strong> You can link any Indian bank (yours or rental). No verification hassles.</p>

<p><strong>Ultra-Fast USDT Selling:</strong> Execute your sell orders instantly and capture every market opportunity.</p>

<p><strong>Swift INR Payouts:</strong> Direct, risk-free deposits to all Indian bank accounts——no extra steps.</p>

<p><strong>100% Genuine and Safe Payment:</strong> Every transaction is protected with advanced security measures, guaranteeing genuine and secure payments.</p>

<p><strong>Track & Download:</strong> Track everything in-app. Need a statement? Download your transaction file instantly.</p>

<p><strong>Round-the-Clock Support:</strong> We offer live agents via chat or phone 24/7 for immediate apps.</p>

<h2>How to Use AngelX: Sell USDT for INR in Minutes</h2>

<p>Here’s a step-by-step guide based on your instructions to perform actions on AngelX:</p>

<p><strong>1. Login Using Mobile Number</strong></p>
<p>— Go to: <Link href="https://www.angelx.com.in/"><strong>https://www.angelx.com.in/</strong></Link></p>
<p>— Click Login / Register.</p>
<p>— Enter your Mobile Number.</p>
<p>— Complete the login (or sign-up) process as per instructions (OTP verification if needed).</p>

<p><strong>2. Complete Profile (Name & Mobile)</strong></p>
<p>— Fill in your Full Name.</p>
<p>— Enter your E-mail ID.</p>
<p>— Save the details.</p>

<p><strong>3. Add Bank Account (Exchange Page)</strong></p>
<p>— On the withdrawal section, look for a Bank Account.</p>
<p>— Add your Bank Account Number, IFSC Code, Bank Name, etc.</p>
<p>— Submit and verify if needed.</p>

<p><strong>4. Add USDT (Deposit Section on Exchange Page)</strong></p>
<p>— On the Exchange Page, navigate to the Deposit section.</p>
<p>— Select USDT (Tether) as the deposit currency.</p>
<p>— You’ll be shown a Wallet Address (TRC20/BEP20).</p>
<p>— Transfer the USDT to the given wallet address.</p>
<p>— Submit the Transaction Hash/ID if required.</p>

<p><strong>5. Balance Update (within 5 minutes)</strong></p>
<p>— After depositing, the balance in your account will be updated within approximately 5 minutes.</p>
<p>— You can check this on your Wallet Balance or Dashboard.</p>

<p><strong>6. Place a Sell Order (Exchange Page)</strong></p>
<p>— Navigate to the Exchange or Trade section.</p>
<p>— Select USDT to INR (or preferred currency).</p>
<p>— Enter the amount of USDT you wish to sell.</p>
<p>— Place the Sell Order.</p>
<p>— Confirm the transaction.</p>

<p>Download <Link href="https://www.angelx.com.in/AngelX.apk"><strong>"AngelX Apk"</strong></Link> now 100% safe, no KYC required. Great for traders upgrading from native USDT-to-INR swaps.</p>
	
	<FAQ />
                </Readmore>
              </div>
            </div>
          </div>
        </div>

		</section> 

	<section className="section-4-table">
		  <div className="container">
			<div className="section-title">
			  <h2 className="title">AngelX vs Other Exchange Platforms</h2>
			  <p>
				AngelX, a modern crypto exchange platform with USDT to INR conversions
				as its primary operating domain offering no KYC trading, quick payouts
				and premium exchange rates tailored specifically for Indian users. It
				stands out from mainstream exchanges with anonymity features and
				simplicity. Here is a comparison table listing the key differences of
				BlueBitcoin with popular alternatives like WazirX, CoinDCX and Binance.
				​
			  </p>
			</div>
					<h4>
				<b>Feature Comparison</b>
			  </h4>
			<div className="table-responsive">
			  
			  <table className="table">
				<tbody>
				  <tr>
					<th>Feature</th>
					<th>AngelX</th>
					<th>WazirX</th>
					<th>CoinDCX</th>
					<th>Binance</th>
				  </tr>
				  <tr>
					<td>KYC Requirement</td>
					<td>None (zero KYC for all trades) </td>
					<td>Mandatory for INR withdrawals</td>
					<td>Mandatory for higher limits </td>
					<td>Mandatory globally</td>
				  </tr>
				  <tr>
					<td>USDT Networks</td>
					<td>TRC20, BEP20, ERC20</td>
					<td>TRC20, ERC20 mainly</td>
					<td>Multiple including TRC20</td>
					<td>All major networks</td>
				  </tr>
				  <tr>
					<td>Transaction Speed</td>
					<td>1-2 min deposits, swift</td>
					<td>INR 10-30 min typical</td>
					<td>5-15 min with KYC</td>
					<td>Instant P2P, slower fiat</td>
				  </tr>
				  <tr>
					<td>INR Payouts </td>
					<td>Direct to any Indian bank</td>
					<td>IMPS/NEFT, business hours</td>
					<td>UPI/IMPS, verified banks only</td>
					<td>P2P via third parties</td>
				  </tr>
				  <tr>
					<td>Fees</td>
					<td>No hidden fees, premium rates</td>
					<td>0.2% trading + withdrawal</td>
					<td>0.1-0.2% + GST</td>
					<td>0.1% spot, higher for fiat</td>
				  </tr>
				  <tr>
					<td>Login Method</td>
					<td>Mobile number only, no password</td>
					<td>Email/phone + password/2FA</td>
					<td>Email + password/2FA</td>
					<td>Email/phone + 2FA</td>
				  </tr>
				  <tr>
					<td>Support</td>
					<td>24/7 live chat/phone</td>
					<td>Ticket-based, chat</td>
					<td>24/7 chat, email</td>
					<td>24/7 global chat</td>
				  </tr>
				</tbody>
			  </table>
			</div>
		  </div>
		</section>

					
</>

	

            </div>
    
<Footer></Footer>
     </div>   
    </div>

  );
}
