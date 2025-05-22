import { BASE_URL, handleError } from "./apiUtils";

/**
 * POST: Create playlist for user.
 * @param { string } username
 * @param { string } playlistName
 * @param { boolean } public
 * @param { boolean } collab
 * @param { string } desc
 * @returns 200 || <Error>
 */
export async function fetchCreatePlaylist(
  username,
  playlistName,
  publicity,
  collab,
  desc
) {
  const response = await fetch(
    `/api/favorites/playlists/create_playlist?:${username}?:${playlistName}?:${publicity}?:${collab}?:${desc}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    }
  );

  if (!response.ok) {
    console.log("Create playlist: ", response);
    throw new Error(`Create playlist HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return {
    data,
    status: response.status,
  };
}

/**
 * POST: Add song(s) to playlist.
 * @param { int } playlist_id
 * @param { list } items
 * @returns 200 || <Error>
 */
export async function fetchAddSongToPlaylist(username, playlist_id, items) {
  const response = await fetch(
    `/api/favorites/playlists/create_playlist?:${username}?:${playlist_id}?:${items}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    }
  );

  if (!response.ok) {
    console.log("Add song to playlist: ", response);
    throw new Error(
      `Add song to playlist HTTP error! status: ${response.status}`
    );
  }

  const data = await response.json();
  return {
    data,
    status: response.status,
  };
}
