import useSWR from "swr";
import { jsonFetcher } from "../utils/fetcher";

export default function useEns(address?: string) {
  return useSWR(
    address ? ["ens", address] : null,
    async () => {
      const json = await jsonFetcher<{ result: string }>(
        "https://rpc.ankr.com/eth/",
        {
          method: "POST",
          body: JSON.stringify({
            id: 1,
            method: "eth_call",
            params: [
              {
                from: "0x0000000000000000000000000000000000000000",
                to: "0x3671ae578e63fdf66ad4f3e12cc0c0d71ac7510c",
                data: `0xcbf8b66c00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000${address!.replace(
                  "0x",
                  ""
                )}`,
              },
              "latest",
            ],
            jsonrpc: "2.0",
          }),
          mode: "cors",
          credentials: "omit",
        }
      );
      return decodeURIComponent(
        json.result.substring(258).replace(/[0-9a-f]{2}/g, "%$&")
      );
    },
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
}
