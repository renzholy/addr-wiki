import useSWR from "swr";
import { jsonFetcher } from "../utils/fetcher";

export default function useTwitter(
  address?: string,
  openseaContract?: {
    collection?: {
      slug: string;
      twitter_username?: string;
    };
    schema_name: "ERC20" | "ERC721" | "ERC1155" | "CRYPTOPUNKS" | "UNKNOWN";
  }
) {
  return useSWR<string | null>(
    address &&
      openseaContract?.collection?.slug &&
      !openseaContract.collection.twitter_username &&
      ["ERC721", "ERC1155"].includes(openseaContract.schema_name)
      ? `/api/twitter?address=${address}&slug=${openseaContract.collection.slug}`
      : null,
    jsonFetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
}
