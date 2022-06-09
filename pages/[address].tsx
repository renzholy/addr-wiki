/* eslint-disable @next/next/no-img-element */

import { getAddress, isAddress } from "@ethersproject/address";
import Head from "next/head";
import { useRouter } from "next/router";
import { CSSProperties, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import BlueMark from "../components/blue-mark";
import ExternalLink from "../components/external-link";
import useCoingecko from "../hooks/use-coingecko";
import useCurve from "../hooks/use-curve";
import useEtherscan from "../hooks/use-etherscan";
import { useOpenseaContract } from "../hooks/use-opensea";
import useSymbol from "../hooks/use-symbol";
import useTwitter from "../hooks/use-twitter";

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
  const { data: openseaContract, isValidating: isValidatingOpenseaContract } =
    useOpenseaContract(address);
  const { data: twitter, isValidating: isValidatingTwitter } = useTwitter(
    address,
    openseaContract
  );
  const { data: coingecko, isValidating: isValidatingCoingecko } =
    useCoingecko(address);
  const { data: symbol, isValidating: isValidatingSymbol } = useSymbol(address);
  const { data: etherscan, isValidating: isValidatingEterscan } =
    useEtherscan(address);
  const { data: curve, isValidating: isValidatingCurve } = useCurve(
    address && openseaContract?.schema_name === "ERC20" ? address : undefined
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
  const name =
    openseaContract &&
    ["ERC721", "ERC1155"].includes(openseaContract.schema_name)
      ? openseaContract?.collection?.name
      : coingecko?.name ||
        openseaContract?.collection?.name ||
        symbol ||
        "Unknown";
  const isValidating =
    isValidatingOpenseaContract ||
    isValidatingTwitter ||
    isValidatingCoingecko ||
    isValidatingSymbol ||
    isValidatingEterscan ||
    isValidatingCurve;

  if (!address) {
    return null;
  }
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
          src={
            openseaContract?.collection?.image_url?.replace(/=s\d+$/, "") ||
            coingecko?.image.large ||
            "/icons/unknown.svg"
          }
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
          href={
            openseaContract?.external_link ||
            coingecko?.links.homepage?.[0] ||
            `https://etherscan.io/address/${address}`
          }
          target="_blank"
          rel="noreferrer"
          style={{ color: "#f2f4f8" }}
        >
          {name}
          {openseaContract?.collection?.safelist_request_status ===
          "verified" ? (
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
        {coingecko?.description.en || openseaContract?.description}
      </p>
      {openseaContract?.collection?.slug &&
      ["ERC721", "ERC1155"].includes(openseaContract.schema_name) ? (
        <>
          <h4 style={{ marginTop: 20, textAlign: "center" }}>Markets</h4>
          <section style={sectionStyle}>
            <ExternalLink
              icon="opensea"
              href={`https://opensea.io/collection/${openseaContract.collection.slug}`}
            />
            <ExternalLink
              icon="looksrare"
              href={`https://looksrare.org/collections/${address}`}
            />
            <ExternalLink
              icon="rarible"
              href={`https://rarible.com/collection/${address}/items`}
            />
            <ExternalLink
              icon="x2y2"
              href={`https://x2y2.io/collection/${address}/items`}
            />
            <ExternalLink
              icon="gem"
              href={`https://gem.xyz/collection/${address}`}
            />
            <ExternalLink
              icon="genie"
              href={`https://www.genie.xyz/collection/${address}`}
            />
          </section>
        </>
      ) : openseaContract?.schema_name === "CRYPTOPUNKS" ? (
        <>
          <h4 style={{ marginTop: 20, textAlign: "center" }}>Markets</h4>
          <section style={sectionStyle}>
            <ExternalLink icon="larvalabs" href="https://cryptopunks.app/" />
          </section>
        </>
      ) : openseaContract?.schema_name === "ERC20" ? (
        <>
          <h4 style={{ marginTop: 20, textAlign: "center" }}>Markets</h4>
          <section style={sectionStyle}>
            <ExternalLink
              icon="uniswap"
              href={`https://info.uniswap.org/#/tokens/${address}`}
            />
            <ExternalLink
              icon="sushiswap"
              href={`https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=${address}&chainId=1`}
            />
            {curve ? (
              <ExternalLink icon="curve" href="https://curve.exchange/pools/" />
            ) : null}
          </section>
        </>
      ) : null}
      {twitter ||
      openseaContract?.collection?.twitter_username ||
      coingecko?.links.twitter_screen_name ||
      openseaContract?.collection?.discord_url ||
      coingecko?.links.chat_url?.some((url) => url.includes("discord")) ||
      coingecko?.links.facebook_username ||
      openseaContract?.collection?.instagram_username ||
      coingecko?.links.subreddit_url ||
      coingecko?.links.telegram_channel_identifier ||
      coingecko?.links.repos_url?.github?.length ? (
        <>
          <h4 style={{ marginTop: 20, textAlign: "center" }}>Socials</h4>
          <section style={sectionStyle}>
            {twitter ? (
              <ExternalLink
                icon="twitter"
                href={`https://twitter.com/${twitter}`}
              />
            ) : openseaContract?.collection?.twitter_username ? (
              <ExternalLink
                icon="twitter"
                href={`https://twitter.com/${openseaContract.collection.twitter_username}`}
              />
            ) : coingecko?.links.twitter_screen_name ? (
              <ExternalLink
                icon="twitter"
                href={`https://twitter.com/${coingecko?.links.twitter_screen_name}`}
              />
            ) : null}
            {openseaContract?.collection?.discord_url ? (
              <ExternalLink
                icon="discord"
                href={openseaContract.collection.discord_url}
              />
            ) : coingecko?.links.chat_url?.some((url) =>
                url.includes("discord")
              ) ? (
              <ExternalLink
                icon="discord"
                href={
                  coingecko.links.chat_url.find((url) =>
                    url.includes("discord")
                  )!
                }
              />
            ) : null}
            {coingecko?.links.facebook_username ? (
              <ExternalLink
                icon="facebook"
                href={`https://www.facebook.com/${coingecko.links.facebook_username}`}
              />
            ) : null}
            {openseaContract?.collection?.instagram_username ? (
              <ExternalLink
                icon="instagram"
                href={`https://www.instagram.com/${openseaContract.collection.instagram_username}`}
              />
            ) : null}
            {coingecko?.links.subreddit_url ? (
              <ExternalLink
                icon="reddit"
                href={coingecko?.links.subreddit_url}
              />
            ) : null}
            {coingecko?.links.telegram_channel_identifier ? (
              <ExternalLink
                icon="telegram"
                href={`https://t.me/${coingecko?.links.telegram_channel_identifier}`}
              />
            ) : null}
            {coingecko?.links.repos_url?.github?.length ? (
              <ExternalLink
                icon="github"
                href={coingecko.links.repos_url.github[0]}
              />
            ) : null}
          </section>
        </>
      ) : null}
      <h4 style={{ marginTop: 20, textAlign: "center" }}>Tools</h4>
      <section style={sectionStyle}>
        <ExternalLink
          icon="etherscan"
          href={`https://etherscan.io/address/${address}`}
        />
        {Array.isArray(etherscan?.result) &&
        etherscan?.result.filter(({ SourceCode }) => SourceCode).length ===
          0 ? null : (
          <ExternalLink
            icon="vscode"
            href={`https://etherscan.deth.net/address/${address}`}
          />
        )}
        {coingecko ? (
          <ExternalLink
            icon="coingecko"
            href={`https://www.coingecko.com/coins/${coingecko.id}`}
          />
        ) : null}
        {openseaContract?.schema_name &&
        ["ERC721", "ERC1155"].includes(openseaContract.schema_name) ? (
          <ExternalLink
            icon="traitsniper"
            href={`https://app.traitsniper.com/${address}`}
          />
        ) : null}
        {openseaContract?.collection?.slug ? (
          <ExternalLink
            icon="nfteye"
            href={`https://nfteye.io/collections/${openseaContract.collection.slug}`}
          />
        ) : null}
      </section>
      <footer
        style={{ height: "calc(env(safe-area-inset-bottom, 0) + 40px)" }}
      />
    </>
  );
}
