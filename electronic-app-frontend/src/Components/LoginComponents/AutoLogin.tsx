import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request, setAuthHeader } from "../../helpers/axios_helper";

const AutoLogin = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const email = import.meta.env.VITE_DEFAULT_EMAIL;
    const password = import.meta.env.VITE_DEFAULT_PASSWORD;

    const credentials = { login: email, password };

    const attemptLogin = async () => {
      try {
        const res = await request("POST", "/login", credentials);
        setAuthHeader(res.data.token);

        setMessage("User logged in successfully.");
      } catch (err) {
        setMessage("User not found. Redirecting to registration...");
        setTimeout(() => {
          navigate("/register", { state: { login: email, password } });
        }, 1500);
      }
    };

    attemptLogin();
  }, [navigate]);

  return <p>{message}</p>;
};

export default AutoLogin;
