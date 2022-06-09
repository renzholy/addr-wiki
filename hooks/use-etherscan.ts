import useSWR from "swr";
import { jsonFetcher } from "../utils/fetcher";

export type EtherscanSourceCode = {
  result: { SourceCode?: string }[];
};

export function useEtherscanSourceCode(address?: string) {
  return useSWR<EtherscanSourceCode>(
    address
      ? `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}`
      : null,
    async (url) => {
      const json = await jsonFetcher<
        | { status: "0"; result: string }
        | { status: "1"; result: { SourceCode?: string }[] }
      >(url);
      if (json.status === "0") {
        throw new Error(json.result);
      }
      return json;
    },
    { revalidateOnFocus: false }
  );
}
