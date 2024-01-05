import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./Placeholder.css"; // Import the CSS file

const Placeholder = () => {
  return (
    <div className="container">
      <h1 className="title">Welcome to PDF parser</h1>
      <div className="buttons">
        <Link to="/login" className="button">
          Login
        </Link>
        <Link to="/register" className="button">
          Signup
        </Link>
      </div>
    </div>
  );
};

export default Placeholder;
