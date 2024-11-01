import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(
        "https://event-management-system-backend-00sp.onrender.com/api/auth/login",
        credentials,
        { withCredentials: true }
      );

      // Store the token in localStorage
      localStorage.setItem("token", res.data.token); // Save the JWT token
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });

      // Store user info in localStorage if needed
      localStorage.setItem("user", JSON.stringify(res.data.details));

      navigate("/dashboard"); // Redirect to the dashboard after login
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
        // Initiates the Google login process
        window.location.href = 'https://event-management-system-backend-00sp.onrender.com/api/auth/google';
    } catch (err) {
        console.error("Error during Google login:", err);
    }
  };


  // Check for Google login redirect success
  useEffect(() => {
    const checkGoogleLogin = async () => {
      try {
        const res = await axios.get(
          "https://event-management-system-backend-00sp.onrender.com/api/auth/status",
          { withCredentials: true }
        );
        console.log("res of : ", res);
        if (res.data.isAuthenticated) {
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
          navigate("/dashboard"); // Redirect to dashboard after successful Google login
        }
      } catch (err) {
        console.log("Google login not authenticated");
      }
    };
    checkGoogleLogin();
  }, [dispatch, navigate]);

  return (
    
    <div className="login">
      <h2></h2>
      <div className="lContainer">
        <input
          type="text"
          placeholder="email"
          id="email"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="lInput"
        />
        <button disabled={loading} onClick={handleClick} className="lButton">
          Login
        </button>

        {/* Google login button */}
        {<button onClick={handleGoogleLogin} className="lButton">
          Login with Google
        </button>}

        {error && <span>{error.message}</span>}
      </div>
    </div>
  
  );
};

export default Login;
