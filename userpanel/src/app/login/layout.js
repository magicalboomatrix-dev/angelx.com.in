export const metadata = {
  title: "AngelX Official → India's #1 Trusted USDT Selling Platform",
  description:
    "Log in to AngelX for converting USDT-to-INR and get the best price instantly. Quick account access, user friendly crypto selling, fast processing and secured payouts.",
  keywords: [
    "angelx usdt price",
    "angelx crypto",
    "angelx usdt sell",
    "angelx login",
    "angelx pro",
    "angelx pro apk",
    "angelx exchange",
  ],
  alternates: {
    canonical: "https://www.angelx.com.in/login",
  },
  robots: {
    index: true,
    follow: true,
    maxSnippet: -1,
    maxImagePreview: "large",
    maxVideoPreview: -1,
  },
  authors: [{ name: "AngelX" }],
  publisher: "AngelX",
};

export default function LoginLayout({ children }) {
  return (
    <>
      <head>
        <meta
          name="description"
          content="Log in to AngelX for converting USDT-to-INR and get the best price instantly. Quick account access, user friendly crypto selling, fast processing and secured payouts."
        />
      </head>
      {children}
    </>
  );
}
