import useSWR from "swr";
import { jsonFetcher } from "../utils/fetcher";

export default function useTwitter(
  address?: string,
  opensea?: {
    collection?: {
      slug: string;
      twitter_username?: string;
    };
    schema_name: "ERC20" | "ERC721" | "ERC1155" | "CRYPTOPUNKS" | "UNKNOWN";
  }
) {
  return useSWR<string | null>(
    address &&
      opensea?.collection?.slug &&
      !opensea.collection.twitter_username &&
      ["ERC721", "ERC1155"].includes(opensea.schema_name)
      ? `/api/twitter?address=${address}&slug=${opensea.collection.slug}`
      : null,
    jsonFetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
}
