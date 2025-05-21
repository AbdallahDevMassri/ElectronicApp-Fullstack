import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  const handleLogout = () => {
    // Remove custom JWT
    localStorage.removeItem("auth_token");

    // Logout from Auth0 if applicable
    if (isAuthenticated) {
      logout({ returnTo: window.location.origin });
    } else {
      // Force page reload to update UI
      window.location.reload();
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
