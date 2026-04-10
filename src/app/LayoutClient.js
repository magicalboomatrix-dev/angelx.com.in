"use client";
import { usePathname } from "next/navigation";

import { ConfirmProvider } from "./components/ConfirmProvider";
import Footer from "./components/footer";
import { ToastProvider } from "./components/ToastProvider";

export default function LayoutClient({ children }) {
  const pathname = usePathname();
  const hideFooter = pathname?.startsWith("/admin");

  return (
    <ConfirmProvider>
      <ToastProvider>
        {children}
        {!hideFooter && <Footer />}
      </ToastProvider>
    </ConfirmProvider>
  );
}
