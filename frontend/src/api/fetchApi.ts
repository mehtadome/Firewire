import { FetchApiResponse } from "./apiUtils";

// INFO: BASE_URL= http://localhost:5000/api

// TYPES
export interface Playlists {
  [key: string]: string;
}
// differentiating for readability
export interface Songs {
  [key: string]: string;
}

// API Functions
/**
 * GET: Grab last 20 liked songs using Spotify username.
 * PATH: http://localhost:5000/api/favorites/<username>
 * @param { username } <string>
 * @returns { songs } <JSON>
*  Example Response:
    {
        "0": "Artist 1 - Song Name 1",
        "1": "Artist 2 - Song Name 2"
    }
 */
export async function fetchLast20Likes<Songs>(
  username: string
): Promise<FetchApiResponse<Songs>> {
  const response = await fetch(`/api/favorites/${username}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  });

  if (!response.ok) {
    console.log("Last 20: ", response);
    throw new Error(`Last 20 HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return {
    data,
    status: response.status,
  };
}

/**
 * GET: Grab user's playlists using Spotify username.
 * PATH: http://localhost:5000/api/favorites/playlists/<username>
 * @param { username } <string>
 * @returns { playlists } <JSON>
 *    
 * Example Response:
    {
        "1": "Playlist Name 1",
        "2": "Playlist Name 2"
    }
 */
export async function fetchUserPlaylists<Playlists>(
  username: string
): Promise<FetchApiResponse<Playlists>> {
  const response = await fetch(`/api/favorites/playlists/${username}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  });

  if (!response.ok) {
    console.log("Playlists: ", response);
    throw new Error(`Playlist HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return {
    data,
    status: response.status,
  };
}

/** Another way to fetch
 * *
 * return fetch(`${BASE_URL}/favorites/${username}`)
  .then((response) => response.json())
  .then((data) => {
    return {
      data,
      status: response.status,
    };
  })
  .catch(handleError);} // dev-defined function handleError()
 * 
 */
