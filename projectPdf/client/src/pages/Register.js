import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css"; // Import the CSS file

function Register() {
  const navigate = useNavigate();
  const [userName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function registerUser(event) {
    event.preventDefault();

    const response = await fetch("http://localhost:1337/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.status === "ok") {
      navigate("/login");
    }

    console.log(data);
  }

  return (
    <div className="container">
      <div className="register-form">
        <h1>Register</h1>
        <form onSubmit={registerUser}>
          <input
            className="input-field"
            value={userName}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name"
          />
          <br />
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
          <input className="submit-button" type="submit" value="Register" />
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
