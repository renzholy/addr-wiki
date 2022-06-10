import useSWR from "swr";
import { jsonFetcher } from "../utils/fetcher";

export type CoinGeckoContract = {
  id: string;
  symbol: string;
  name: string;
  description: { en: string };
  links: {
    homepage: string[];
    facebook_username?: string;
    subreddit_url?: string;
    telegram_channel_identifier?: string;
    twitter_screen_name?: string;
    official_forum_url?: string[];
    repos_url?: {
      github?: string[];
      bitbucket?: string[];
    };
    chat_url?: string[];
  };
  image: { large: string };
};

export function useCoinGeckoContract(address?: string) {
  return useSWR<CoinGeckoContract>(
    address
      ? `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`
      : null,
    jsonFetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
}
