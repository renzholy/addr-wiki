import useSWR from "swr";
import { jsonFetcher } from "../utils/fetcher";

export type Mirror = {
  avatarURL: string;
  displayName: string;
  description?: string;
  domain?: string;
};

export default function useMirror(address?: string) {
  return useSWR<Mirror>(
    address ? `/api/mirror?address=${address}` : null,
    jsonFetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
}
