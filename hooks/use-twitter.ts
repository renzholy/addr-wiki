import useSWR from "swr";
import { jsonFetcher } from "../utils/fetcher";
import { OpenSeaContract } from "./use-opensea";

export default function useTwitter(
  address?: string,
  openseaContract?: OpenSeaContract
) {
  return useSWR<string>(
    address &&
      openseaContract?.collection?.slug &&
      !openseaContract.collection.twitter_username &&
      ["ERC721", "ERC1155"].includes(openseaContract.schema_name)
      ? `/api/twitter?address=${address}&slug=${openseaContract.collection.slug}`
      : undefined,
    jsonFetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
}
