import useSWR from "swr";
import { jsonFetcher } from "../utils/fetcher";

export default function useBit(address?: string) {
  return useSWR(
    address ? ["bit", address] : null,
    async () => {
      const json = await jsonFetcher<{ result: { data: { account: string } } }>(
        "https://indexer-v1.did.id/",
        {
          method: "POST",
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 0,
            method: "das_reverseRecord",
            params: [{ type: "blockchain", key_info: { key: address } }],
          }),
          mode: "cors",
          credentials: "omit",
        }
      );
      return json.result.data.account;
    },
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
}
