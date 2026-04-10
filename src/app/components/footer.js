'use client'
//import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Footer() {
        const pathname = usePathname();
        const [mineHref, setMineHref] = useState('/login');

        useEffect(() => {
            if (typeof window === 'undefined') {
                return;
            }

            setMineHref(localStorage.getItem('token') ? '/mine' : '/login');
        }, [pathname]);

        const getActiveTab = () => {
            if (pathname === '/' || pathname?.startsWith('/home')) {
                return 'home';
            }

            if (pathname?.startsWith('/exchange')) {
                return 'exchange';
            }

            const minePaths = ['/mine', '/setting', '/history', '/statements', '/bank', '/invite', '/referals'];
            if (minePaths.some((path) => pathname === path || pathname?.startsWith(`${path}/`))) {
                return 'mine';
            }

            return '';
        };

        const activeTab = getActiveTab();

  return (
    <div>
      <main >        
        <footer className="footer">
            <div className="bx">
                                <Link href="/" className={`tb ${activeTab === 'home' ? 'active' : ''}`}>
                <div className="icon">
                    <img src="/images/l-home.png" className="noact" />
                    <img src="/images/d-home.png" className="act" />
                </div>
                <p>Home</p>
                </Link>
            </div>
            <div className="bx">
                <Link href="/exchange" className={`tb ${activeTab === 'exchange' ? 'active' : ''}`}
                    >
                <div className="icon">
                    <img src="/images/l-exchange.png" className="noact" />
                    <img src="/images/d-exchange.png" className="act" />
                </div>
                <p>Exchange</p>
                </Link>
            </div>
            <div className="bx">
                                <Link href={mineHref} className={`tb ${activeTab === 'mine' ? 'active' : ''}`}>
                <div className="icon">
                    <img src="/images/l-mine.png" className="noact" />
                    <img src="/images/d-mine.png" className="act" />
                </div>
                <p>Mine</p>
                </Link>
            </div>
            </footer>
      </main>  
</div>
      
  )
}