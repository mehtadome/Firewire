import { Last20Likes } from "../components/displays/last20likesDisplay";
import { UserPlaylists } from "../components/displays/playlistDisplay";
import "./Favorites.css";
import { ConnTest } from "../components/displays/connectionDisplay";

export interface FavoritesProps {
  username: string;
}

/**
 * Displays two FCs by passing down username as a property.
 * @param { username } Spotify username.
 * @returns <FC>
 */
const Favorites: React.FC<FavoritesProps> = ({ username }) => {
  return (
    <>
      <div className="library-insights">
        <h1>{username}'s Library Insights</h1>
        <Last20Likes username={username} />
        <UserPlaylists username={username} />
        <ConnTest username={username} />
      </div>
    </>
  );
};

export default Favorites;
