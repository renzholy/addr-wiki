import { compact } from "lodash-es";
import { CoinGeckoContract } from "../hooks/use-coingecko";
import { EtherscanSourceCode } from "../hooks/use-etherscan";
import { Mirror } from "../hooks/use-mirror";
import { OpenSeaContract, OpenSeaUser } from "../hooks/use-opensea";
import { Icon, Section } from "./constants";

export function parse(
  address: string,
  {
    ens,
    code,
    openSeaContract,
    openSeaUser,
    twitter,
    coinGeckoContract,
    symbol,
    etherscanSourceCode,
    curvePool,
    mirror,
  }: {
    ens?: string;
    code?: boolean;
    openSeaContract?: OpenSeaContract;
    openSeaUser?: OpenSeaUser;
    twitter?: string;
    coinGeckoContract?: CoinGeckoContract;
    symbol?: string;
    etherscanSourceCode?: EtherscanSourceCode;
    curvePool?: boolean;
    mirror?: Mirror;
  }
): {
  name: string;
  image: string;
  description?: string;
  verified: boolean;
  sections: { [key in Section]: { icon: Icon; href: string }[] };
} {
  return {
    name:
      ens ||
      (openSeaContract &&
      ["ERC721", "ERC1155"].includes(openSeaContract.schema_name)
        ? openSeaContract?.collection?.name
        : coinGeckoContract?.name ||
          openSeaContract?.collection?.name ||
          symbol) ||
      openSeaUser?.username ||
      mirror?.displayName ||
      "Unknown",
    image:
      openSeaContract?.collection?.image_url?.replace(/=s\d+$/, "") ||
      coinGeckoContract?.image.large ||
      openSeaUser?.account.profile_img_url?.replace(/=s\d+$/, "") ||
      mirror?.avatarURL ||
      "/icons/unknown.svg",
    description:
      coinGeckoContract?.description.en ||
      openSeaContract?.description ||
      mirror?.description,
    verified:
      openSeaContract?.collection?.safelist_request_status === "verified",
    sections: {
      [Section.Profile]: code
        ? []
        : compact([
            {
              icon: Icon.Rainbow,
              href: `https://rainbow.me/${address}`,
            },
            {
              icon: Icon.Debank,
              href: `https://debank.com/profile/${address}`,
            },
            mirror
              ? {
                  icon: Icon.Mirror,
                  href: mirror.domain
                    ? `https://${mirror.domain}`
                    : `https://mirror.xyz/${address}/`,
                }
              : null,
          ]),
      [Section.Market]:
        openSeaContract?.collection?.slug &&
        ["ERC721", "ERC1155"].includes(openSeaContract.schema_name)
          ? [
              {
                icon: Icon.OpenSea,
                href: `https://opensea.io/collection/${openSeaContract.collection.slug}`,
              },
              {
                icon: Icon.LooksRare,
                href: `https://looksrare.org/collections/${address}`,
              },
              {
                icon: Icon.Rarible,
                href: `https://rarible.com/collection/${address}/items`,
              },
              {
                icon: Icon.X2Y2,
                href: `https://x2y2.io/collection/${address}/items`,
              },
              {
                icon: Icon.Gem,
                href: `https://gem.xyz/collection/${address}`,
              },
              {
                icon: Icon.Genie,
                href: `https://www.genie.xyz/collection/${address}`,
              },
            ]
          : openSeaContract?.schema_name === "CRYPTOPUNKS"
          ? [
              {
                icon: Icon.LarvaLabs,
                href: "https://cryptopunks.app/",
              },
            ]
          : openSeaContract?.schema_name === "ERC20"
          ? compact([
              {
                icon: Icon.Uniswap,
                href: `https://info.uniswap.org/#/tokens/${address}`,
              },
              {
                icon: Icon.SushiSwap,
                href: `https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=${address}&chainId=1`,
              },
              curvePool
                ? {
                    icon: Icon.Curve,
                    href: "https://curve.exchange/pools/",
                  }
                : null,
            ])
          : [],
      [Section.Social]: compact([
        twitter
          ? {
              icon: Icon.Twitter,
              href: `https://twitter.com/${twitter}`,
            }
          : openSeaContract?.collection?.twitter_username
          ? {
              icon: Icon.Twitter,
              href: `https://twitter.com/${openSeaContract.collection.twitter_username}`,
            }
          : coinGeckoContract?.links.twitter_screen_name
          ? {
              icon: Icon.Twitter,
              href: `https://twitter.com/${coinGeckoContract?.links.twitter_screen_name}`,
            }
          : null,
        openSeaContract?.collection?.discord_url
          ? { icon: Icon.Discord, href: openSeaContract.collection.discord_url }
          : coinGeckoContract?.links.chat_url?.some((url) =>
              url.includes("discord")
            )
          ? {
              icon: Icon.Discord,
              href: coinGeckoContract.links.chat_url.find((url) =>
                url.includes("discord")
              )!,
            }
          : null,
        coinGeckoContract?.links.facebook_username
          ? {
              icon: Icon.Facebook,
              href: `https://www.facebook.com/${coinGeckoContract.links.facebook_username}`,
            }
          : null,
        openSeaContract?.collection?.instagram_username
          ? {
              icon: Icon.Instagram,
              href: `https://www.instagram.com/${openSeaContract.collection.instagram_username}`,
            }
          : null,
        coinGeckoContract?.links.subreddit_url
          ? {
              icon: Icon.Reddit,
              href: coinGeckoContract?.links.subreddit_url,
            }
          : null,
        coinGeckoContract?.links.telegram_channel_identifier
          ? {
              icon: Icon.Telegram,
              href: `https://t.me/${coinGeckoContract?.links.telegram_channel_identifier}`,
            }
          : null,
        coinGeckoContract?.links.repos_url?.github?.length
          ? {
              icon: Icon.GitHub,
              href: coinGeckoContract.links.repos_url.github[0],
            }
          : null,
      ]),
      [Section.Other]: compact([
        openSeaContract?.external_link || coinGeckoContract?.links.homepage?.[0]
          ? {
              icon: Icon.Website,
              href:
                openSeaContract?.external_link ||
                coinGeckoContract?.links.homepage?.[0]!,
            }
          : null,
        {
          icon: Icon.Etherscan,
          href: `https://etherscan.io/address/${address}`,
        },
        !code ||
        (Array.isArray(etherscanSourceCode?.result) &&
          etherscanSourceCode?.result.filter(({ SourceCode }) => SourceCode)
            .length === 0)
          ? null
          : {
              icon: Icon.Vscode,
              href: `https://etherscan.deth.net/address/${address}`,
            },
        coinGeckoContract
          ? {
              icon: Icon.CoinGecko,
              href: `https://www.coingecko.com/coins/${coinGeckoContract.id}`,
            }
          : null,
        openSeaContract?.schema_name &&
        ["ERC721", "ERC1155"].includes(openSeaContract.schema_name)
          ? {
              icon: Icon.TraitSniper,
              href: `https://app.traitsniper.com/${address}`,
            }
          : null,
        openSeaContract?.collection?.slug &&
        openSeaContract?.schema_name &&
        ["ERC721", "ERC1155"].includes(openSeaContract.schema_name)
          ? {
              icon: Icon.NFTEye,
              href: `https://nfteye.io/collections/${openSeaContract.collection.slug}`,
            }
          : null,
      ]),
    },
  };
}
