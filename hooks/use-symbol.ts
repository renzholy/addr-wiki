import { Contract, providers } from "ethers";
import { Interface } from "ethers/lib/utils";
import useSWR from "swr";

export default function useSymbol(address?: string) {
  return useSWR(
    address ? ["symbol", address] : null,
    async () => {
      const contract = new Contract(
        address as string,
        new Interface(["function symbol() public view returns (string)"]),
        new providers.CloudflareProvider(1)
      );
      return contract.symbol();
    },
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
}
