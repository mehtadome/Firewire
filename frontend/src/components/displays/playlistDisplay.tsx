import { useEffect, useState } from "react";
import { fetchUserPlaylists, Playlists } from "../../api/fetchApi";
import "./playlistDisplay.css";
import { FavoritesProps } from "../../pages/Favorites";

/**
 * Display user's created playlists.
 * @param { username } <string>
 * @returns { component } <FC>
 */
export const UserPlaylists: React.FC<FavoritesProps> = ({ username }) => {
  /**
   * Uncomment and use the following line if the below error breaks your code:
   *  Argument of type '{}' is not assignable to parameter of type 'SetStateAction<Playlists>'.ts(2345)
   *
   * // const [playlists, setPlaylists] = useState<unknown>({});
   *
   * Description: TypeScript will not be able to determine what "type" of data will be passed back down from your backend.
   *  * We assign it an empty dict knowing that is its base state.
   */
  // const [playlists, setPlaylists] = useState<Playlists>({});
  const [playlists, setPlaylists] = useState<Playlists>({});

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetchUserPlaylists(username);

        if (response.data) {
          console.log(response.data);
          setPlaylists(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [username]);

  if (loading) return <div className="loading-buffer">Loading...</div>;
  if (error) return <div className="error-box">Error: {error}</div>;

  if (Object.keys(playlists).length === 0) {
    return <div className="empty-state">No playlists found</div>;
  }

  return (
    <div className="playlist-container">
      <div className="playlist-header">
        <h1>{username}'s Playlists</h1>
      </div>
      <div className="playlist-grid">
        {Object.entries(playlists).map(([id, song]) => (
          <div key={id} className="playlist-card">
            <div className="playlist-info">
              <div className="playlist-row">
                <h3 className="playlist-name">{song}</h3>
                <button className="play-button">▶</button>
              </div>
              {/* <p className="playlist-details">{song.artist}</p> */}
              {/* <span className="track-count"> Add track count if available 20 tracks</span> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
