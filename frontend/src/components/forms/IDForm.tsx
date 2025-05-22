import { useNavigate } from "react-router-dom";
import "./IDForm.css";

interface IDFormProps {
  username: string;
  onClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Ingests the entered username and loads two components showing some data about user's library.
 * @param { username } Spotify username.
 * @param { onClick } Functionality for submiting form.
 * @returns <FC>
 */
const IDForm = ({ username, onClick }: IDFormProps) => {
  // Store the username for future usage
  localStorage.setItem("spotify_username", username);

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim()) return;

    navigate(`/favorites/${username}`);
  };

  return (
    <form className="id-form" onSubmit={handleSubmit}>
      <input
        className="id-form-input"
        type="text"
        value={username}
        onChange={onClick}
        placeholder="Enter your Spotify username"
        required
      />
      <button
        className="id-form-submit-button"
        type="submit"
        disabled={!username.trim()}
      >
        Submit
      </button>
    </form>
  );
};

export default IDForm;
