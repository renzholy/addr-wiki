/* eslint-disable @next/next/no-img-element */

import { getAddress, isAddress } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { CSSProperties, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import useSWR from "swr";
import BlueMark from "../components/blue-mark";
import ExternalLink from "../components/external-link";
import useCoingecko from "../hooks/use-coingecko";
import useCurve from "../hooks/use-curve";
import useEtherscan from "../hooks/use-etherscan";
import useOpensea from "../hooks/use-opensea";
import useSymbol from "../hooks/use-symbol";
import { jsonFetcher } from "../utils/fetcher";

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
  const { data: opensea } = useOpensea(address);
  const { data: twitter } = useSWR<string | null>(
    address && opensea?.collection?.slug && !opensea.collection.twitter_username
      ? `/api/twitter?address=${address}&slug=${opensea.collection.slug}`
      : null,
    jsonFetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
  const { data: coingecko } = useCoingecko(address);
  const { data: symbol } = useSymbol(address);
  const { data: etherscan } = useEtherscan(address);
  const { data: curve } = useCurve(
    address && opensea?.schema_name === "ERC20" ? address : undefined
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

  if (!address) {
    return null;
  }
  return (
    <>
      {address && isAddress(address) ? (
        <CopyToClipboard
          text={getAddress(address)}
          onCopy={() => setCopied(true)}
        >
          <header
            onClick={() => {}}
            style={{
              ...headerStyle,
              cursor: "pointer",
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
        <div style={{ position: "relative", width: 160, height: 160 }}>
          <div style={{ position: "absolute" }}>
            <a
              href={
                opensea?.external_link ||
                coingecko?.links.homepage[0] ||
                `https://etherscan.io/address/${address}`
              }
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={
                  opensea?.collection?.image_url.replace(/=s\d+$/, "") ||
                  coingecko?.image.large ||
                  "/icons/unknown.svg"
                }
                alt="logo"
                width={160}
                height={160}
                style={{
                  background: "#21262a",
                  borderRadius: "50%",
                  objectFit: "cover",
                  width: 160,
                  height: 160,
                }}
              />
            </a>
          </div>
          {opensea?.collection?.safelist_request_status === "verified" ? (
            <BlueMark
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 40,
                height: 40,
              }}
            />
          ) : null}
        </div>
      </div>
      <h3 style={{ textAlign: "center", marginBottom: 20 }}>
        <a
          href={
            opensea?.external_link ||
            coingecko?.links.homepage?.[0] ||
            `https://etherscan.io/address/${address}`
          }
          target="_blank"
          rel="noreferrer"
          style={{ color: "#f2f4f8" }}
        >
          {coingecko?.name || opensea?.collection?.name || symbol || "Unknown"}
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
        {coingecko?.description.en || opensea?.description}
      </p>
      {opensea?.collection?.slug &&
      ["ERC721", "ERC1155"].includes(opensea.schema_name) ? (
        <>
          <h4 style={{ marginTop: 20, textAlign: "center" }}>Markets</h4>
          <section style={sectionStyle}>
            <ExternalLink
              icon="opensea"
              href={`https://opensea.io/collection/${opensea.collection.slug}`}
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
      ) : opensea?.schema_name === "CRYPTOPUNKS" ? (
        <>
          <h4 style={{ marginTop: 20, textAlign: "center" }}>Markets</h4>
          <section style={sectionStyle}>
            <ExternalLink icon="larvalabs" href="https://cryptopunks.app/" />
          </section>
        </>
      ) : opensea?.schema_name === "ERC20" ? (
        <>
          <h4 style={{ marginTop: 20, textAlign: "center" }}>Markets</h4>
          <section style={sectionStyle}>
            <ExternalLink
              icon="uniswap"
              href={`https://info.uniswap.org/#/tokens/${address}`}
            />
            {curve ? (
              <ExternalLink icon="curve" href={`https://curve.fi/${curve}`} />
            ) : null}
          </section>
        </>
      ) : null}

      {twitter ||
      opensea?.collection?.twitter_username ||
      coingecko?.links.twitter_screen_name ||
      opensea?.collection?.discord_url ||
      coingecko?.links.chat_url?.some((url) => url.includes("discord")) ||
      coingecko?.links.facebook_username ||
      opensea?.collection?.instagram_username ||
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
            ) : opensea?.collection?.twitter_username ? (
              <ExternalLink
                icon="twitter"
                href={`https://twitter.com/${opensea.collection.twitter_username}`}
              />
            ) : coingecko?.links.twitter_screen_name ? (
              <ExternalLink
                icon="twitter"
                href={`https://twitter.com/${coingecko?.links.twitter_screen_name}`}
              />
            ) : null}
            {opensea?.collection?.discord_url ? (
              <ExternalLink
                icon="discord"
                href={opensea.collection.discord_url}
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
            {opensea?.collection?.instagram_username ? (
              <ExternalLink
                icon="instagram"
                href={`https://www.instagram.com/${opensea.collection.instagram_username}`}
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
        {coingecko ? (
          <ExternalLink
            icon="coingecko"
            href={`https://www.coingecko.com/coins/${coingecko.id}`}
          />
        ) : null}
        {Array.isArray(etherscan?.result) &&
        etherscan?.result.filter(({ SourceCode }) => SourceCode).length ? (
          <ExternalLink
            icon="vscode"
            href={`https://etherscan.deth.net/address/${address}`}
          />
        ) : null}
        {opensea?.schema_name &&
        ["ERC721", "ERC1155"].includes(opensea.schema_name) ? (
          <ExternalLink
            icon="traitsniper"
            href={`https://app.traitsniper.com/${address}`}
          />
        ) : null}
      </section>
      <footer
        style={{ height: "calc(env(safe-area-inset-bottom, 0) + 40px)" }}
      />
    </>
  );
}
