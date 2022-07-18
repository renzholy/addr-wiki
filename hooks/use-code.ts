import useSWR from "swr";
import { jsonFetcher } from "../utils/fetcher";

export default function useCode(address?: string) {
  return useSWR(
    address ? ["code", address] : null,
    async () => {
      const json = await jsonFetcher<{ result: string }>(
        "https://rpc.ankr.com/eth/",
        {
          method: "POST",
          body: JSON.stringify({
            id: 1,
            method: "eth_getCode",
            params: [address, "latest"],
            jsonrpc: "2.0",
          }),
          mode: "cors",
          credentials: "omit",
        }
      );
      return json.result !== "0x";
    },
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
}
