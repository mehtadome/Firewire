export const BASE_URL: string = `/api`;

export interface FetchApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

interface SpotipyResponse {
  [key: number]: string;
}

/**
 * Returns the response from the backend.
 * @param { response } response
 * @returns response <json> || <Error>
 */
export async function handleResponse(
  response: Response
): Promise<FetchApiResponse<SpotipyResponse>> {
  if (response.ok) {
    console.log("apiUtils says the raw response is: ", response.json());
    return response.json();
  }
  if (response.status === 400) {
    const error = await response.text();
    throw new Error(error);
  }
  throw new Error("Network response was not ok.");
}
