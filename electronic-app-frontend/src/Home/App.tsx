import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginButton from "../Components/LoginComponents/LoginButton";
import LogoutButton from "../Components/LoginComponents/LogoutButton";
import FetchMessageButton from "../Components/FetchMessageButton";

import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="logo">
            <span className="eye"></span>
            <span className="title">ElectronicApp</span>
          </div>

          <div className="nav-buttons">
            {!isAuthenticated && <LoginButton />}
            {isAuthenticated && <LogoutButton />}
          </div>
        </nav>

        <div className="main-content">
          <h1>Welcome to ElectronicApp</h1>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {isAuthenticated ? (
                    <FetchMessageButton />
                  ) : (
                    <p>You need to log in to fetch messages.</p>
                  )}
                </>
              }
            />
          </Routes>
        </div>

        <footer className="footer">
          <a
            className="footer-signature"
            href="https://github.com/AbdallahDevMassri"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abdallah Massri
          </a>
          <p>
            © {new Date().getFullYear()} ElectronicApp. All rights reserved.
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
