import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const FetchMessageButton = () => {
  const [message, setMessage] = useState("");
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
  const fetchMessage = async () => {
    try {
      // Get the Auth0 access token
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: audience,
        },
      });

      const response = await fetch("http://localhost:8080/api/products", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.text();
      setMessage(data);
      console.log("Message:", data);
    } catch (error) {
      console.error("Error fetching message:", error);
    }
  };

  return (
    isAuthenticated && (
      <div style={{ marginTop: "20px" }}>
        <button onClick={fetchMessage}>Get Message from API</button>
        {message && <p style={{ marginTop: "10px" }}>Response: {message}</p>}
      </div>
    )
  );
};

export default FetchMessageButton;
