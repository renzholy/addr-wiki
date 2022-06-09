/* eslint-disable @next/next/no-img-element */

import { getAddress, isAddress } from "@ethersproject/address";
import Head from "next/head";
import { useRouter } from "next/router";
import { CSSProperties, Fragment, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import BlueMark from "../components/blue-mark";
import ExternalLink from "../components/external-link";
import { useCoinGeckoContract as useCoinGeckoContract } from "../hooks/use-coingecko";
import { useCurvePool } from "../hooks/use-curve";
import { useEtherscanSourceCode } from "../hooks/use-etherscan";
import { useOpenSeaContract, useOpenSeaUser } from "../hooks/use-opensea";
import useSymbol from "../hooks/use-symbol";
import useTwitter from "../hooks/use-twitter";
import { parse } from "../utils/parser";

const headerStyle: CSSProperties = {
  zIndex: 1000,
  position: "sticky",
  top: 0,
  background: "#21262a",
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const sectionStyle: CSSProperties = {
  margin: "0 auto",
  width: "fit-content",
  padding: "0 20px",
  textAlign: "center",
  lineHeight: 0,
};

export default function AddressPage() {
  const router = useRouter();
  const address = router.query.address as string | undefined;
  const { data: openSeaContract, isValidating: isValidatingOpenseaContract } =
    useOpenSeaContract(address);
  const { data: openSeaUser, isValidating: isValidatingOpenseaUser } =
    useOpenSeaUser(address);
  const { data: twitter, isValidating: isValidatingTwitter } = useTwitter(
    address,
    openSeaContract
  );
  const {
    data: coinGeckoContract,
    isValidating: isValidatingCoinGeckoContract,
  } = useCoinGeckoContract(address);
  const { data: symbol, isValidating: isValidatingSymbol } = useSymbol(address);
  const {
    data: etherscanSourceCode,
    isValidating: isValidatingEterscanSourceCode,
  } = useEtherscanSourceCode(address);
  const { data: curvePool, isValidating: isValidatingCurvePool } = useCurvePool(
    address && openSeaContract?.schema_name === "ERC20" ? address : undefined
  );
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = setTimeout(() => {
      setCopied(false);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [copied]);

  const isValidating =
    isValidatingOpenseaContract ||
    isValidatingOpenseaUser ||
    isValidatingTwitter ||
    isValidatingCoinGeckoContract ||
    isValidatingSymbol ||
    isValidatingEterscanSourceCode ||
    isValidatingCurvePool;

  if (!address || !isAddress(address)) {
    return null;
  }
  const { name, image, link, description, verified, sections } = parse(
    address,
    {
      openSeaContract,
      openSeaUser,
      twitter,
      coinGeckoContract,
      symbol,
      etherscanSourceCode,
      curvePool,
    }
  );
  return (
    <>
      <Head>
        <title>{name} | ADDR•WIKI</title>
      </Head>
      {address && isAddress(address) ? (
        <CopyToClipboard
          text={getAddress(address)}
          onCopy={() => setCopied(true)}
        >
          <header
            style={{
              ...headerStyle,
              cursor: "pointer",
              animation: isValidating
                ? "2s linear infinite progress-bar-stripes"
                : undefined,
              backgroundImage: isValidating
                ? "linear-gradient(135deg,rgba(255,255,255,.1) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.1) 50%,rgba(255,255,255,.1) 75%,transparent 75%,transparent)"
                : undefined,
              backgroundSize: "1rem 1rem",
            }}
          >
            {copied ? "Copied!" : getAddress(address)}
          </header>
        </CopyToClipboard>
      ) : (
        <header style={headerStyle}>
          ADDR<span style={{ color: "#878d96" }}>·</span>WIKI
        </header>
      )}
      <div style={{ margin: "40px auto", lineHeight: 0, width: "fit-content" }}>
        <img
          src={image}
          alt="logo"
          width={160}
          height={160}
          style={{
            background: "#21262a",
            borderRadius: 20,
            objectFit: "cover",
            width: 160,
            height: 160,
          }}
        />
      </div>
      <h3 style={{ textAlign: "center", marginBottom: 20 }}>
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#f2f4f8" }}
        >
          {name}
          {verified ? (
            <BlueMark
              style={{
                marginLeft: 5,
                marginRight: -25,
                width: 20,
                height: 20,
                verticalAlign: "middle",
              }}
            />
          ) : null}
        </a>
      </h3>
      <p
        style={{
          margin: "0 auto",
          width: "100%",
          marginBottom: 40,
          padding: "0 20px",
          textAlign: "center",
          color: "#a2a9b0",
          maxWidth: 600,
          fontSize: "0.9em",
          display: "-webkit-box",
          overflow: "hidden",
          textOverflow: "ellipsis",
          WebkitLineClamp: 5,
          WebkitBoxOrient: "vertical",
        }}
      >
        {description}
      </p>
      {Object.entries(sections).map(([key, value]) =>
        value.length ? (
          <Fragment key={key}>
            <h4 style={{ marginTop: 20, textAlign: "center" }}>{key}</h4>
            <section style={sectionStyle}>
              {value.map((item) => (
                <ExternalLink
                  key={item.icon}
                  icon={item.icon}
                  href={item.href}
                />
              ))}
            </section>
          </Fragment>
        ) : null
      )}
      <footer
        style={{ height: "calc(env(safe-area-inset-bottom, 0) + 40px)" }}
      />
    </>
  );
}
