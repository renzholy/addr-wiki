import useSWR from "swr";
import { jsonFetcher } from "../utils/fetcher";

export type OpenSeaContract = {
  collection?: {
    name: string;
    slug: string;
    image_url?: string;
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
};

export function useOpenSeaContract(address?: string) {
  return useSWR<OpenSeaContract>(
    address ? `https://api.opensea.io/api/v1/asset_contract/${address}` : null,
    jsonFetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
}

export type OpenSeaUser = {
  username: string;
  account: { user: { username: string }; profile_img_url?: string };
};

export function useOpenSeaUser(address?: string) {
  return useSWR<OpenSeaUser>(
    address ? `https://api.opensea.io/api/v1/user/${address}` : null,
    jsonFetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
}
