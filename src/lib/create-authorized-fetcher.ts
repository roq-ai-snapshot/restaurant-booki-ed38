export function createAuthorizedFetcher(token: string | undefined | null) {
  return async function fetcher(url: string, options: RequestInit, params?: Record<string, any>) {
    if (params) {
      url = url + '?' + `q=${encodeURIComponent(JSON.stringify(params))}`;
    }
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        authorization: token ? `Bearer ${token}` : '',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${response.statusText}\n${JSON.stringify(errorData)}`);
    }

    return await response.json();
  };
}
