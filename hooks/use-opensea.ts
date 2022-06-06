import useSWR from "swr";
import { jsonFetcher } from "../utils/fetcher";

export default function useOpensea(address?: string) {
  return useSWR<{
    collection?: {
      name: string;
      slug: string;
      image_url?: string;
      banner_image_url?: string;
      instagram_username?: string;
      discord_url?: string;
      medium_username?: string;
      twitter_username?: string;
      wiki_url?: string;
      dev_seller_fee_basis_points: string;
      safelist_request_status:
        | "verified"
        | "approved"
        | "requested"
        | "not_requested";
    };
    created_date: string;
    description?: string;
    external_link?: string;
    schema_name: "ERC20" | "ERC721" | "ERC1155" | "CRYPTOPUNKS" | "UNKNOWN";
  }>(
    address ? `https://api.opensea.io/api/v1/asset_contract/${address}` : null,
    jsonFetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
}
