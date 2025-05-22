import { FavoritesProps } from "../../pages/Favorites";
import "./connectionDisplay.css";
import { useEffect, useState } from "react";

// Should simply display "Yo, Hello World!"
export const ConnTest: React.FC<FavoritesProps> = ({ username }) => {
  const [test, setTest] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/connection")
      .then((response) => response.json())
      .then((data) => setTest(data))
      .catch((error) => {
        setError(error);
        console.log("Error fetching test from API: ", error);
      });
  }, []);

  if (error) return <div className="error-box">Error: {error}</div>;

  return (
    <div className="connection-container">
      <div className="connection-header">
        <h4>{username}'s Test Response</h4>
        <h5>{test?.message}</h5>
      </div>
    </div>
  );
};
