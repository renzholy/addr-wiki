import useSWR from "swr";
import { jsonFetcher } from "../utils/fetcher";

export default function useSymbol(address?: string) {
  return useSWR(
    address ? ["symbol", address] : null,
    async () => {
      const json = await jsonFetcher<{ result: string }>(
        "https://cloudflare-eth.com/",
        {
          method: "POST",
          body: JSON.stringify({
            id: 1,
            method: "eth_call",
            params: [{ to: address, data: "0x95d89b41" }, "latest"],
            jsonrpc: "2.0",
          }),
          mode: "cors",
          credentials: "omit",
        }
      );
      return Buffer.from(json.result.substring(130), "hex").toString();
    },
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
}
