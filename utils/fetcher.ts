export async function jsonFetcher<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (response.ok) {
    return response.json();
  }
  throw new Error(await response.text());
}
