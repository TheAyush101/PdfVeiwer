import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "./Login.css"; // Import the CSS file
import { useAuth0 } from "@auth0/auth0-react";

function Login({ setIsAuthenticated }) {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
   const auth = useAuth0();

  async function loginUser(event) {
    event.preventDefault();
    try {
      console.log("Sending login request...");
      const response = await fetch("http://localhost:1337/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
 console.log("Response:", response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

    if (data.user) {
      setIsAuthenticated(true);
      localStorage.setItem("token", data.token);
      alert("Login successful");
      navigate("/pdf", { state: { emailId: email } });
    } else {
      alert("Please check your username or password");
    }

    } catch (error) {
      console.error("Fetch error:", error);
    }
    console.log(email);
    console.log(localStorage.getItem("token"));

  }

  return (
    <div className="container">
      <div className="login-form">
        <h1>Login</h1>
        {isAuthenticated ? (
          <>
            <p>Welcome, {email}!</p>
            <button onClick={() => logout()}>Log Out</button>
            <Link to="/pdf">Go to PDF</Link>
          </>
        ) : (
          <form onSubmit={loginUser}>
            <input
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
            />
            <br />
            <input
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
            <br />
            {/* <input className="submit-button" type="submit" value="Login" /> */}
            <button onClick={() => loginWithRedirect()}>
              Log In with Auth0
            </button>
          </form>
        )}

        <p>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
  
export default Login;
         