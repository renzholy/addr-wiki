import { getAddress } from "ethers/lib/utils";
import useSWR from "swr";
import { jsonFetcher } from "../utils/fetcher";

type PoolResponse = {
  data: {
    poolData: {
      id: string;
      coinsAddresses: string[];
      address: string;
      usdTotal: number;
    }[];
  };
};

type GaugesResponse = {
  data: {
    gauges: {
      [key: string]: {
        factory?: boolean;
        type: "crypto";
        swap: string;
      };
    };
  };
};

export default function useCurve(address?: string) {
  return useSWR<string | undefined>(
    address ? ["curve", address] : null,
    async () => {
      if (!address) {
        return;
      }
      const [main, crypto, factory, factoryCrypto, gauges] = await Promise.all([
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
        jsonFetcher<GaugesResponse>("https://api.curve.fi/api/getGauges"),
      ]);
      const gaugesArray = Object.entries(gauges.data.gauges);
      const pool = [
        ...main.data.poolData,
        ...crypto.data.poolData,
        ...factory.data.poolData,
        ...factoryCrypto.data.poolData,
      ]
        .filter(
          (data) =>
            data.coinsAddresses.includes(getAddress(address)) &&
            gaugesArray.some((gauge) => gauge[1].swap === data.address)
        )
        .sort((a, b) => b.usdTotal - a.usdTotal)[0];
      const gauge = pool
        ? gaugesArray.find((gauge) => gauge[1].swap === pool.address)
        : undefined;
      return gauge
        ? gauge[1].factory
          ? `${gauge[1].type === "crypto" ? "factory-crypto" : "factory"}/${
              pool.id.split("-")[pool.id.split("-").length - 1]
            }`
          : gauge[0]
        : undefined;
    },
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
}
