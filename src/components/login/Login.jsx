import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // Standard email/password login
  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(
        "https://event-management-system-backend-uela.onrender.com/api/auth/login",
        credentials,
        { withCredentials: true }
      );

      // Store the token and user details
      localStorage.setItem("token", res.data.token);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      localStorage.setItem("user", JSON.stringify(res.data.details));

      navigate("/dashboard");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response?.data });
    }
  };

  // Google login handler
  const handleGoogleLogin = () => {
    window.location.href = "https://event-management-system-backend-uela.onrender.com/api/auth/google";
  };

  // Fetch Google login status after redirection
  useEffect(() => {
    console.log("Attempting to fetch Google user...");
    const fetchGoogleUser = async () => {
      try {
        const res = await axios.get(
          "https://event-management-system-backend-uela.onrender.com/api/auth/status",
          { withCredentials: true }
        );
        console.log("google user",res.data.isAuthenticated);
        if (res.data.isAuthenticated) {
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Error fetching Google user after login:", err);
        dispatch({ type: "LOGIN_FAILURE", payload: { message: "Failed to fetch Google user" } });
      }
    };
  
    // Only fetch Google user status if the user is already authenticated
    fetchGoogleUser();
  }, [dispatch, navigate]);
  

  return (
    <>
    
    <div className="login">
      
      <div className="lContainer">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Email"
          id="email"
          onChange={handleChange}
          className="lInput"
          value={credentials.email}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          onChange={handleChange}
          className="lInput"
          value={credentials.password}
        />
        <button disabled={loading} onClick={handleClick} className="lButton">
          Login
        </button>

        {/* Google login button */}
        <button onClick={handleGoogleLogin} className="lButton">
          Login with Google
        </button>

        {error && <span className="errorMessage">{error.message}</span>}
      </div>
    </div>
    </>
  );
};

export default Login;
