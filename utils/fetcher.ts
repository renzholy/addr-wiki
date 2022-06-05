export async function jsonFetcher<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, init);
  if (response.ok) {
    return response.json();
  }
  throw new Error(await response.text());
}
