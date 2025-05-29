import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../Buttons/LoginButton";
import LogoutButton from "../Buttons/LogoutButton";

const Navbar = ({ onSelectCategory, onSearch }) => {
  // Auth0 hooks to manage authentication
  // and to get the access token silently
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // ----------------------------------------------------------fetching the data ---------------------------------------------------------------
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (value) => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: audience,
        },
      });

      const response = await fetch("http://localhost:8080/api/products", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setSearchResults(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //-------------------------------------------------------------- search By Keyword ------------------------------
  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: audience,
          },
        });

        const response = await fetch(
          `http://localhost:8080/api/products/search/${value}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const results = await response.json();
        setSearchResults(results);
        setNoResults(results.length === 0);
        console.log(results);
      } catch (error) {
        console.error("Error searching:", error.message);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };
  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="container-fluid">
            <a
              className="navbar-brand"
              href="https://github.com/AbdallahDevMassri"
            >
              Abdallah Massri
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/add_product">
                    Add Product
                  </a>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="/"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Categories
                  </a>

                  <ul className="dropdown-menu">
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>

                <li className="nav-item"></li>
              </ul>
              <button className="theme-btn" onClick={() => toggleTheme()}>
                {theme === "dark-theme" ? (
                  <i className="bi bi-moon-fill"></i>
                ) : (
                  <i className="bi bi-sun-fill"></i>
                )}
              </button>
              <div className="d-flex align-items-center cart">
                <a href="/cart" className="nav-link text-dark">
                  <i
                    className="bi bi-cart me-2"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    Cart
                  </i>
                </a>

                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)} // Set searchFocused to true when search bar is focused
                  onBlur={() => setSearchFocused(false)} // Set searchFocused to false when search bar loses focus
                />
                {showSearchResults && (
                  <ul className="list-group">
                    {searchResults.length > 0
                      ? searchResults.map((result) => (
                          <li key={result.id} className="list-group-item">
                            <a
                              href={`/product/${result.id}`}
                              className="search-result-link"
                            >
                              <span>{result.name}</span>
                            </a>
                          </li>
                        ))
                      : noResults && (
                          <p className="no-results-message">
                            No Prouduct with such Name
                          </p>
                        )}
                  </ul>
                )}

                <div className="nav-buttons">
                  {!isAuthenticated && <LoginButton />}
                  {isAuthenticated && <LogoutButton />}
                </div>

                <div />
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
