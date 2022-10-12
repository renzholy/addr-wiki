import { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import "../styles/global.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-0F5B2L3F33"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-0F5B2L3F33');
        `}
      </Script>
      <Head>
        <title>ADDR•WIKI</title>
        <base target="_blank" />
        <meta name="referrer" content="no-referrer" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
