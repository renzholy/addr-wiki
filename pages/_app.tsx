import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/global.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
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
