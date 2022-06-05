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
    <div style={{ padding: 4, lineHeight: 0 }}>
      <h6>
        {coingecko?.name || opensea?.collection.name || "-"}
        <span style={{ float: "right" }}>
          {!opensea || opensea?.schema_name === "CRYPTOPUNKS"
            ? ""
            : opensea.schema_name}
        </span>
      </h6>
      {opensea?.external_link ? (
        <ExternalLink
          icon={opensea.collection.image_url}
          href={opensea.external_link}
        />
      ) : null}
      {coingecko?.links.homepage.length ? (
        <ExternalLink
          icon={coingecko.image.large}
          href={coingecko.links.homepage[0]}
        />
      ) : null}

      {opensea?.collection.slug && opensea.schema_name !== "ERC20" ? (
        <>
          <h6 style={{ marginTop: 4 }}>Market</h6>
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
        </>
      ) : null}

      <h6 style={{ marginTop: 4 }}>Social</h6>
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

      <h6 style={{ marginTop: 4 }}>Tool</h6>
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
    </div>
  );
}
