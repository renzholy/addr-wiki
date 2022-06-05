import { useRouter } from "next/router";
import useSWR from "swr";
import ExternalLink from "../components/external-link";
import { jsonFetcher } from "../utils/fetcher";

export default function AddressPage() {
  const router = useRouter();
  const address = router.query.address;

  const { data: opensea } = useSWR<{
    collection: {
      name: string;
      slug: string;
      image_url: string;
      instagram_username?: string;
      discord_url?: string;
      medium_username?: string;
      twitter_username?: string;
      wiki_url?: string;
      dev_seller_fee_basis_points: string;
    };
    created_date: string;
    description?: string;
    external_link?: string;
    schema_name: "ERC20" | "ERC721" | "ERC1155" | "CRYPTOPUNKS";
  }>(
    address ? `https://api.opensea.io/api/v1/asset_contract/${address}` : null,
    jsonFetcher,
    { revalidateOnFocus: true, shouldRetryOnError: false }
  );
  const { data: coingecko } = useSWR<{
    id: string;
    symbol: string;
    name: string;
    links: {
      homepage: string[];
      facebook_username?: string;
      subreddit_url?: string;
      telegram_channel_identifier?: string;
      twitter_screen_name?: string;
      repos_url?: {
        github?: string[];
        bitbucket?: string[];
      };
      chat_url?: string[];
    };
    image: { large: string };
  }>(
    address
      ? `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`
      : null,
    jsonFetcher,
    { revalidateOnFocus: true, shouldRetryOnError: false }
  );

  if (!address) {
    return null;
  }
  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          background: "#21262a",
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ADDR<span style={{ color: "#878d96" }}>·</span>WIKI
      </header>
      <div style={{ margin: "20px auto", lineHeight: 0, width: "fit-content" }}>
        {opensea?.external_link ? (
          <ExternalLink
            icon={opensea.collection.image_url.replace(/=s\d+$/, "")}
            href={opensea.external_link}
            size={160}
          />
        ) : coingecko?.links.homepage.length ? (
          <ExternalLink
            icon={coingecko.image.large}
            href={coingecko.links.homepage[0]}
            size={160}
          />
        ) : null}
      </div>
      <h2 style={{ textAlign: "center" }}>
        {coingecko?.name || opensea?.collection.name || "-"}
      </h2>
      <p style={{ margin: 20, textAlign: "center", color: "#a2a9b0" }}>
        {opensea?.description}
      </p>
      {opensea?.collection.slug && opensea.schema_name !== "ERC20" ? (
        <>
          <h4 style={{ marginTop: 40, textAlign: "center" }}>Markets</h4>
          <section style={{ margin: "0 auto", width: "fit-content" }}>
            <ExternalLink
              icon="opensea"
              href={`https://opensea.io/collection/${opensea.collection.slug}`}
            />
            <ExternalLink
              icon="looksrare"
              href={`https://looksrare.org/collections/${address}`}
            />
            <ExternalLink
              icon="x2y2"
              href={`https://x2y2.io/collection/${opensea.collection.slug}/items`}
            />
            <ExternalLink
              icon="gem"
              href={`https://gem.xyz/collection/${opensea.collection.slug}`}
            />
          </section>
        </>
      ) : null}

      <h4 style={{ marginTop: 20, textAlign: "center" }}>Socials</h4>
      <section style={{ margin: "0 auto", width: "fit-content" }}>
        {opensea?.collection.twitter_username ? (
          <ExternalLink
            icon="twitter"
            href={`https://twitter.com/${opensea.collection.twitter_username}`}
          />
        ) : null}
        {coingecko?.links.twitter_screen_name ? (
          <ExternalLink
            icon="twitter"
            href={`https://twitter.com/${coingecko?.links.twitter_screen_name}`}
          />
        ) : null}
        {opensea?.collection.discord_url ? (
          <ExternalLink icon="discord" href={opensea.collection.discord_url} />
        ) : null}
        {coingecko?.links.chat_url?.some((url) => url.includes("discord")) ? (
          <ExternalLink
            icon="discord"
            href={
              coingecko.links.chat_url.find((url) => url.includes("discord"))!
            }
          />
        ) : null}
        {coingecko?.links.facebook_username ? (
          <ExternalLink
            icon="facebook"
            href={`https://www.facebook.com/${coingecko.links.facebook_username}`}
          />
        ) : null}
        {opensea?.collection.instagram_username ? (
          <ExternalLink
            icon="instagram"
            href={`https://www.instagram.com/${opensea.collection.instagram_username}`}
          />
        ) : null}
        {coingecko?.links.subreddit_url ? (
          <ExternalLink icon="reddit" href={coingecko?.links.subreddit_url} />
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

      <h4 style={{ marginTop: 20, textAlign: "center" }}>Tools</h4>
      <section style={{ margin: "0 auto", width: "fit-content" }}>
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
        {opensea?.collection.slug ? (
          <ExternalLink
            icon="traitsniper"
            href={`https://app.traitsniper.com/${opensea.collection.slug}`}
          />
        ) : null}
      </section>
      <footer
        style={{
          position: "sticky",
          bottom: 0,
          marginTop: 40,
          background: "#21262a",
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ERC
        <span style={{ color: "#878d96" }}>·</span>
        {!opensea || opensea?.schema_name === "CRYPTOPUNKS"
          ? null
          : opensea.schema_name.replace("ERC", "")}
      </footer>
    </>
  );
}
