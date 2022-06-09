import { getAddress } from "@ethersproject/address";
import useSWR from "swr";
import { jsonFetcher } from "../utils/fetcher";

type PoolResponse = {
  data: {
    poolData: {
      coinsAddresses: string[];
    }[];
  };
};

export function useCurvePool(address?: string) {
  return useSWR<boolean | undefined>(
    address ? ["curve", address] : null,
    async () => {
      if (!address) {
        return;
      }
      const [main, crypto, factory, factoryCrypto] = await Promise.all([
        jsonFetcher<PoolResponse>(
          "https://api.curve.fi/api/getPools/ethereum/main"
        ),
        jsonFetcher<PoolResponse>(
          "https://api.curve.fi/api/getPools/ethereum/crypto"
        ),
        jsonFetcher<PoolResponse>(
          "https://api.curve.fi/api/getPools/ethereum/factory"
        ),
        jsonFetcher<PoolResponse>(
          "https://api.curve.fi/api/getPools/ethereum/factory-crypto"
        ),
      ]);
      const pools = [
        ...main.data.poolData,
        ...crypto.data.poolData,
        ...factory.data.poolData,
        ...factoryCrypto.data.poolData,
      ];
      const a = getAddress(address);
      return pools.some((pool) => pool.coinsAddresses.includes(a));
    },
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
}
