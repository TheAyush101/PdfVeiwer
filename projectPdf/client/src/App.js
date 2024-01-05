import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Placeholder from "./pages/Placeholder";
import Pdf from "./pages/Pdf";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />

          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              isAuthenticated ? <Placeholder /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/pdf"
            element={isAuthenticated ? <Pdf /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
