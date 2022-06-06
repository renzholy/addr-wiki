import { AppProps } from "next/app";
import Head from "next/head";
import "@coreui/coreui/dist/css/coreui.min.css";
import "../styles/global.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>ADDR•WIKI</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
